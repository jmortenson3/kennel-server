import express, { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions, VerifyErrors } from 'jsonwebtoken';

import config from '../../config';
import { hashPassword, comparePasswords, nowISO } from '../utils';
import db from '../db';

const router = express.Router();

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
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

      const options: SignOptions = {
        algorithm: config.hashFunction,
        expiresIn: config.tokenExpirationSeconds,
      };

      const token = jwt.sign(user, config.tokenKey, options);

      res.cookie('token', token, {
        maxAge: config.tokenExpirationSeconds * 1000,
        secure: true,
        httpOnly: true,
      });

      res.status(204).send();
    } catch (err) {
      console.log(err);
      next({ error: 'login: could not find user in db' });
    }
  }
);

router.post(
  '/signup',
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next({
        error: 'email or password not supplied',
        status: 401,
      });
    }

    let emailLower = email.toLowerCase();

    // Check email availability
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

    let hashedPassword: string | unknown;

    try {
      hashedPassword = await hashPassword(password);
    } catch (err) {
      return next({ error: 'signup: problem protecting password' });
    }

    try {
      let query =
        'INSERT INTO users (email, hashed_password, created_datetime, updated_datetime) ' +
        'VALUES ($1, $2, $3, $4) RETURNING email;';

      const rows = await db.query(query, [
        emailLower,
        hashedPassword,
        nowISO(),
        nowISO(),
      ]);

      const user = {
        emailLower,
      };

      const options: SignOptions = {
        algorithm: config.hashFunction,
        expiresIn: config.tokenExpirationSeconds,
      };

      const token = jwt.sign(user, config.tokenKey, options);

      res.cookie('token', token, {
        maxAge: config.tokenExpirationSeconds * 1000,
        httpOnly: true,
      });

      res.status(204).send();
    } catch (err) {
      console.log(err);
      next({ error: 'signup: problem happened' });
    }
  }
);

router.post(
  '/recall',
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies || !req.cookies.token) {
      console.log('Cookies not set');
      return next({ error: 'can not remember user', status: 401 });
    }

    console.log(`token: ${req.cookies.token}`);

    jwt.verify(req.cookies.token, config.tokenKey, async function(
      err: VerifyErrors,
      decodedPayload: string | object
    ) {
      if (err) {
        console.log(err);
      }
      if (decodedPayload) {
        const userPayload = <any>decodedPayload;
        console.log('The payload was decoded OK');
        console.log(JSON.stringify(decodedPayload));
        const user = {
          email: userPayload.email,
        };
        res.status(200).json({ data: user });
      } else {
        console.log('Something went wrong decoding the payload...');
        console.log(decodedPayload);
        next({ error: 'bad token', status: 403 });
      }
    });
  }
);

router.get('/logout', (req, res, next) => {
  res.clearCookie('token');
  res.status(204).send();
});

module.exports = router;
