import jwt, { VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { logem, getUserFromToken } from '../utils';
import config from '../../config';

export const authenticatedRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.cookies || !req.cookies.token) {
      throw new Error('login is required to access this resource');
    }

    jwt.verify(req.cookies.token, config.tokenKey, function(
      err: VerifyErrors,
      decodedPayload: string | object
    ) {
      if (err) {
        throw err;
      }
      if (decodedPayload) {
        logem('The payload was decoded OK');
        next();
      } else {
        logem('Something went wrong decoding the payload...');
        logem(<string>decodedPayload);
        next({ message: 'bad token', status: 403 });
      }
    });
  } catch (err) {
    next({ message: err, statusCode: 403 });
  }
};

export const authorizedRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.cookies || !req.cookies.token) {
      throw new Error('unauthorized');
    }

    const user = getUserFromToken(req.cookies.token);
    if (user.id !== req.params.user_id) {
      throw new Error(
        'The user in cookies does not match the user in the request params.'
      );
    } else {
      next();
    }
  } catch (err) {
    next({ message: err, statusCode: 403 });
  }
};
