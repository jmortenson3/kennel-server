import jwt, { VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { logem, getUserFromToken } from '../utils';
import config from '../../config';

export const authenticatedRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies || !req.cookies.token) {
    return next({ message: 'login is required', status: 401 });
  }

  jwt.verify(req.cookies.token, config.tokenKey, function(
    err: VerifyErrors,
    decodedPayload: string | object
  ) {
    if (err) {
      console.log(err);
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
};

export const authorizedRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies || !req.cookies.token) {
    logem('Cookies not set');
    return next({ message: 'login is required', status: 401 });
  }

  try {
    const user = getUserFromToken(req.cookies.token);
    if (user.id !== req.params.user_id) {
      next({
        error:
          'The user in cookies does not match the user in the request params.',
        status: 403,
      });
    } else {
      next();
    }
  } catch (err) {
    next({ message: 'error getting user from cookie', status: 400 });
  }
};