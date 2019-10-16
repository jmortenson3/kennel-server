const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../db');

/**
 * Time in milliseconds -
 */
exports.nowMilliseconds = () => {
  return new Date().getTime();
};

exports.nowISO = () => {
  return new Date().toISOString();
};

exports.hashPassword = async plaintextPassword => {
  const SALT_ROUNDS = 10;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(plaintextPassword, SALT_ROUNDS, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
  return hashedPassword;
};

exports.comparePasswords = async (plaintextPassword, hashedPassword) => {
  try {
    const match = await bcrypt.compare(plaintextPassword, hashedPassword);
    return match;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const urlIdCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZY0123456789_-'.split(
  ''
);

exports.genShortenedUrlId = () => {
  const charLimit = 6;
  let urlId = '';
  for (let i = 0; i < charLimit; i++) {
    const randIndex = Math.floor(Math.random() * urlIdCharacters.length);
    const randChar = urlIdCharacters[randIndex];
    urlId += randChar;
  }
  return urlId;
};

exports.getUserFromToken = token => {
  const user = jwt.decode(token);
  return user;
};

exports.getTokenFromCookie = cookie => {
  let cookies = cookie.split('=');
  let token = cookies[cookies.indexOf('token') + 1];
  return token;
};

exports.setLastLoginDate = async email => {
  try {
    let query = 'UPDATE users SET last_login_date = $1 where email = $2;';
    await db.query(query, [this.nowISO(), email]);
  } catch (err) {
    console.log('Error updating user lastLoginDate');
    console.log(err.message);
  }
};

exports.logem = msg => {
  console.log(this.nowISO() + '  ' + msg);
};
