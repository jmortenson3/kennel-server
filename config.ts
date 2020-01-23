import { Algorithm } from 'jsonwebtoken';

export default {
  tokenKey: '!JA#4akjaA$AL&(FjhAW$ma__w41PO1o@',
  hashFunction: <Algorithm>'HS256',
  tokenExpirationSeconds: 86400,
  clientUrl: 'http://localhost:3000',
  db: {
    uri:
      'postgres://erkespgx:CpM3hOGTq7rwW3M9YqM9hHky4YqGzBau@salt.db.elephantsql.com:5432/erkespgx',
  },
  bypassCookies: true,
};
