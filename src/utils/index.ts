import bcrypt from 'bcrypt';
import jwt, { VerifyErrors } from 'jsonwebtoken';

/**
 * Time in milliseconds -
 */
export const nowMilliseconds = (): number => {
  return new Date().getTime();
};

export const nowISO = (): string => {
  return new Date().toISOString();
};

export const hashPassword = async (
  plaintextPassword: string
): Promise<unknown> => {
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

export const comparePasswords = async (
  plaintextPassword: string,
  hashedPassword: string
) => {
  try {
    const match = await bcrypt.compare(plaintextPassword, hashedPassword);
    return match;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const decodeToken = async (
  token: string,
  tokenKey: string
): Promise<unknown> => {
  const decodedToken = await new Promise((resolve, reject) => {
    jwt.verify(token, tokenKey, function(
      err: VerifyErrors,
      decodedPayload: string | object
    ) {
      if (err) {
        reject(err);
      }
      if (decodedPayload) {
        resolve(decodedPayload);
      } else {
        console.log(decodedPayload);
        reject('Something went wrong decoding the token.');
      }
    });
  });
  return decodedToken;
};

const urlIdCharacters =
  'abcdefghijklmnopqrstuvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXZY' +
  '0123456789_-'.split('');

export const genShortenedUrlId = () => {
  const charLimit = 6;
  let urlId = '';
  for (let i = 0; i < charLimit; i++) {
    const randIndex = Math.floor(Math.random() * urlIdCharacters.length);
    const randChar = urlIdCharacters[randIndex];
    urlId += randChar;
  }
  return urlId;
};

export const getUserFromToken = (token: string): any => {
  const user = <any>jwt.decode(token);
  return user;
};

export const getTokenFromCookie = (cookie: string) => {
  let cookies = cookie.split('=');
  let token = cookies[cookies.indexOf('token') + 1];
  return token;
};

export const logem = function(msg: string) {
  console.log(this.nowISO() + '  ' + msg);
};

export const clone = (obj: Object) => {
  return JSON.parse(JSON.stringify(obj));
};

export const isValidUUID = (uuid: string): boolean => {
  const validUUIDRegex = new RegExp(
    '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
  );
  return validUUIDRegex.test(uuid);
};
