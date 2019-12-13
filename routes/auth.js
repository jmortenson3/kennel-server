const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { tokenKey, tokenExpirationSeconds, hashFunction } = require('../config');
const { hashPassword, comparePasswords, nowISO } = require('../utils');
const { db } = require('../db');

router.post('/login', async (req, res, next) => {
  const { password, email } = req.body;

  if (!email || !password) {
    return next({
      error: 'email or password not supplied',
      status: 401,
    });
  }

  try {
    let emailLower = email.toLowerCase();
    let query = 'SELECT email, hashed_password FROM users WHERE email = $1';

    const { rows } = await db.query(query, [emailLower]);
    const hashedPassword = rows[0].hashed_password;

    if (!hashedPassword) {
      return next({ error: 'login: no hashed password from db' });
    }

    const correctPassword = await comparePasswords(password, hashedPassword);
    if (!correctPassword) {
      return next({ error: 'login: password mismatch' });
    }

    const user = {
      email: rows[0].email,
    };

    const token = jwt.sign(user, tokenKey, {
      algorithm: hashFunction,
      expiresIn: tokenExpirationSeconds,
    });

    // max age in milliseconds
    console.log('Setting cookies');
    res.cookie('token', token, {
      maxAge: tokenExpirationSeconds * 1000,
      httpOnly: true,
    });

    res.status(200).json({ message: `${emailLower} logged in.`, user });
  } catch (err) {
    console.log(err);
    next({ error: 'login: could not find user in db' });
  }
});

router.post('/signup', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next({
      error: 'email or password not supplied',
      status: 401,
    });
  }

  let emailLower = email.toLowerCase();

  //
  // Check email availability
  //
  try {
    const query = 'SELECT email FROM users WHERE email = $1';
    const { rows } = await db.query(query, [emailLower]);
    if (rows && rows.length != 0) {
      throw Error();
    }
  } catch (err) {
    console.log(err);
    return next({ error: 'signup: email taken' });
  }

  // Hash up
  let hashedPassword = '';

  try {
    hashedPassword = await hashPassword(password);
  } catch (err) {
    return next({ error: 'signup: problem protecting password' });
  }

  //
  // Go ahead and create the user
  //
  try {
    let query =
      'INSERT INTO users (email, hashed_password, created_datetime, updated_datetime) VALUES ($1, $2, $3, $4) RETURNING email;';

    const rows = await db.query(query, [
      emailLower,
      hashedPassword,
      nowISO(),
      nowISO(),
    ]);

    const user = {
      emailLower,
    };

    // Give them a token!
    const token = jwt.sign(user, tokenKey, {
      algorithm: hashFunction,
      expiresIn: tokenExpirationSeconds,
    });

    console.log('Setting cookies');
    // max age in milliseconds
    res.cookie('token', token, {
      maxAge: tokenExpirationSeconds * 1000,
      httpOnly: true,
    });
    res.status(200).json({ message: `${emailLower} logged in.`, user });
  } catch (err) {
    console.log(err);
    next({ error: 'signup: problem happened' });
  }
});

router.post('/recall', async (req, res, next) => {
  if (!req.cookies || !req.cookies.token) {
    console.log('Cookies not set');
    return next({ error: 'can not remember user', status: 401 });
  }

  console.log(`token: ${req.cookies.token}`);

  jwt.verify(req.cookies.token, tokenKey, async function(err, decodedPayload) {
    if (err) {
      console.log(err);
    }
    if (decodedPayload) {
      console.log('The payload was decoded OK');
      console.log(JSON.stringify(decodedPayload));
      const user = {
        email: decodedPayload.email,
      };
      res.status(200).json({ message: 'user remembered', user });
    } else {
      console.log('Something went wrong decoding the payload...');
      console.log(decodedPayload);
      next({ error: 'bad token', status: 403 });
    }
  });
});

router.get('/logout', (req, res, next) => {
  console.log('COOKIE:');
  console.log(req.cookies);
  res.clearCookie('token');
  res.status(200).send();
});

module.exports = router;
