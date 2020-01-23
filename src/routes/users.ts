import express, { Request, Response, NextFunction } from 'express';

import { UserService } from '../services/user';
import { getUserFromToken, nowISO } from '../utils';
import db from '../db';
import { IMembership } from '../interfaces/IMembership';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let query =
      'SELECT email, created_datetime, updated_datetime ' + 'FROM users;';
    const { rows } = await db.query(query);
    res.status(200).json({ data: rows });
  } catch (err) {
    next({ message: err, statusCode: 400 });
  }
});

router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies || !req.cookies.token) {
      throw new Error('login is required');
    }

    const userToken = getUserFromToken(req.cookies.token);
    const userEmail = userToken.email ? userToken.email.toLowerCase() : null;

    if (!userEmail) {
      throw new Error('user email not found in cookies');
    }

    const userService = new UserService();
    const user = await userService.GetUserDetails(userEmail);
    res.status(200).json({ data: user });
  } catch (err) {
    console.log(err);
    next({ message: err, statusCode: 400 });
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let id = req.params.id;
    if (!id) {
      return next({
        error: 'user email is not supplied',
      });
    }
    const userEmail = id.trim().toLowerCase();
    const userService = new UserService();
    const user = await userService.GetUserDetails(userEmail);
    res.status(200).json({ data: user });
  } catch (err) {
    next({ message: 'could not find user', status: 488 });
  }
});

router.post(
  '/:id/memberships',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { org_id } = req.body;
      const id = req.params.id;

      if (!org_id || !id) {
        throw new Error('org_id or user id is not defined');
      }

      const userEmail = id.trim().toLowerCase();
      const now = nowISO();
      const membership: IMembership = {
        userEmail,
        org_id,
        created_datetime: now,
        updated_datetime: now,
      };
      const userService = new UserService();
      await userService.CreateMembership(membership);
      res.status(200).json({ data: membership });
    } catch (err) {
      next({ message: err, statusCode: 400 });
    }
  }
);

router.get(
  '/:id/memberships',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        throw new Error('user id not defined');
      }

      const userEmail = id.trim().toLowerCase();
      const userService = new UserService();
      let rows: any[];

      if (req.query.org_id) {
        rows = await userService.GetMembershipsByOrg(
          userEmail,
          req.query.org_id
        );
      } else {
        rows = await userService.GetMemberships(userEmail);
      }

      res.status(200).json({ data: rows });
    } catch (err) {
      console.log(err.message);
      next({ message: err, statusCode: 400 });
    }
  }
);

router.put(
  '/:id/memberships',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      let {
        org_id,
        can_accept_appointments,
        can_deny_appointments,
        can_edit_kennel_layout,
      } = req.body;

      if (!org_id || !id) {
        throw new Error('org_id or user id is not defined');
      }

      const userEmail = id.trim().toLowerCase();
      const membership: IMembership = {
        org_id,
        userEmail,
        can_accept_appointments,
        can_deny_appointments,
        can_edit_kennel_layout,
        updated_datetime: nowISO(),
      };
      const userService = new UserService();
      const updatedMembership = await userService.UpdateMembership(membership);
      res.status(200).json(updatedMembership);
    } catch (err) {
      next({ message: err, statusCode: 400 });
    }
  }
);

router.delete(
  '/:id/memberships',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const { org_id } = req.body;

      if (!org_id || !id) {
        throw new Error('org_id or user id is not defined');
      }

      const userEmail = id.trim().toLowerCase();
      const membership: IMembership = {
        userEmail,
        org_id,
      };
      const userService = new UserService();
      await userService.DeleteMembership(membership);
      res.status(200).json({});
    } catch (err) {
      next({ message: err, statusCode: 400 });
    }
  }
);

module.exports = router;
