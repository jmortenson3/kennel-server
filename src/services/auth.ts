import jwt, { SignOptions, VerifyErrors } from 'jsonwebtoken';
import { IUser, IUserSafe } from '../interfaces/IUser';
import db from '../db';
import { nowISO, hashPassword, comparePasswords, decodeToken } from '../utils';
import config from '../../config';

export default class AuthService {
  constructor() {}

  public async SignUp(
    user: IUser
  ): Promise<{ user: IUserSafe; token: string }> {
    const { email, password } = user;
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
      throw new Error('signup: email taken');
    }

    try {
      let hashedPassword: string | unknown;
      hashedPassword = await hashPassword(password);
      let query =
        'INSERT INTO users (email, hashed_password, created_datetime, updated_datetime) ' +
        'VALUES ($1, $2, $3, $4) RETURNING email;';

      await db.query(query, [emailLower, hashedPassword, nowISO(), nowISO()]);

      const user: IUserSafe = {
        email: emailLower,
      };

      const options: SignOptions = {
        algorithm: config.hashFunction,
        expiresIn: config.tokenExpirationSeconds,
      };

      const token = jwt.sign(user, config.tokenKey, options);
      return { user, token };
    } catch (err) {
      throw err;
    }
  }

  public async Login(user: IUser): Promise<{ user: IUserSafe; token: string }> {
    const { email, password } = user;
    let emailLower = email.toLowerCase();

    try {
      let query = 'SELECT email, hashed_password FROM users WHERE email = $1';

      const { rows } = await db.query(query, [emailLower]);
      const hashedPassword = rows[0].hashed_password;

      if (!hashedPassword) {
        throw Error('login: no hashed password from db');
      }

      const correctPassword = await comparePasswords(password, hashedPassword);
      if (!correctPassword) {
        throw Error('login: password mismatch');
      }

      const user: IUserSafe = {
        email: rows[0].email,
      };

      const options: SignOptions = {
        algorithm: config.hashFunction,
        expiresIn: config.tokenExpirationSeconds,
      };

      const token = jwt.sign(user, config.tokenKey, options);
      return { user, token };
    } catch (err) {
      throw err;
    }
  }

  public async Recall(token: string) {
    try {
      const decodedToken = await decodeToken(token, config.tokenKey);
      if (decodedToken) {
        const userPayload = <any>decodedToken;
        const user = {
          email: userPayload.email,
        };
        return user;
      } else {
        throw new Error('token could not be decoded');
      }
    } catch (err) {
      console.log('Something went wrong decoding the payload...');
      throw err;
    }
  }
}
