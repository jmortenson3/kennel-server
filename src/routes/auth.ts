import express, { Request, Response, NextFunction } from 'express';

import AuthService from '../services/auth';
import config from '../../config';

const router = express.Router();

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, email } = req.body;

    if (!email || !password) {
      throw new Error('email or password not supplied');
    }

    try {
      const authService = new AuthService();
      const { user, token } = await authService.Login({ email, password });
      res.cookie('token', token, config.cookieOptions);
      res.status(200).json({ data: user });
    } catch (err) {
      next({ message: err.message, statusCode: 400 });
    }
  }
);

router.post(
  '/signup',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error('email or password not supplied');
      }

      const authService = new AuthService();
      const { newUser, token } = await authService.SignUp({ email, password });

      res.cookie('token', token, config.cookieOptions);
      res.status(200).json({ data: newUser });
    } catch (err) {
      next({ message: err.message, statusCode: 400 });
    }
  }
);

router.post(
  '/recall',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.cookies || !req.cookies.token) {
        throw new Error('no cookie - can not remember user');
      }

      const authService = new AuthService();
      const { user, token } = await authService.Recall(req.cookies.token);

      res.cookie('token', token, config.cookieOptions);
      res.status(200).json({ data: user });
    } catch (err) {
      next({ message: err.message, statusCode: 400 });
    }
  }
);

router.get('/logout', (req, res, next) => {
  res.clearCookie('token');
  res.status(204).send();
});

module.exports = router;
