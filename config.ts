import { Algorithm, SignOptions } from 'jsonwebtoken';
import { CookieOptions } from 'express';

const tokenTTL = 86400;
const tokenTTLMilliseconds = tokenTTL * 1000;

const jwtSignOptions: SignOptions = {
  algorithm: <Algorithm>'HS256',
  expiresIn: tokenTTL,
};

const cookieOptions: CookieOptions = {
  maxAge: tokenTTLMilliseconds,
  httpOnly: true,
};

export default {
  tokenKey: '!JA#4akjaA$AL&(FjhAW$ma__w41PO1o@',
  jwtSignOptions,
  cookieOptions,
  clientUrl: 'http://localhost:3000',
  db: {
    uri:
      'postgres://erkespgx:CpM3hOGTq7rwW3M9YqM9hHky4YqGzBau@salt.db.elephantsql.com:5432/erkespgx',
  },
  bypassCookies: true,
};
