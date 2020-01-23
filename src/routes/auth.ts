import express, { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions, VerifyErrors } from 'jsonwebtoken';
import AuthService from '../services/auth';

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
      const authService = new AuthService();
      const { user, token } = await authService.Login({ email, password });

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
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next({
          error: 'email or password not supplied',
          status: 401,
        });
      }
      const authService = new AuthService();
      const { user, token } = await authService.SignUp({ email, password });

      res.cookie('token', token, {
        //TODO move "* 1000" to a utils method called "convertSecondsToMilliseconds"
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
    try {
      if (!req.cookies || !req.cookies.token) {
        throw new Error('can not remember user');
      }

      const authService = new AuthService();
      const user = await authService.Recall(req.cookies.token);

      res.status(200).json({ data: user });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/logout', (req, res, next) => {
  res.clearCookie('token');
  res.status(204).send();
});

module.exports = router;
