import express, { Request, Response, NextFunction } from 'express';

import { UserService } from '../services/user';
import { getUserFromToken, nowISO } from '../utils';
import { IMembership } from '../interfaces/IMembership';
import { UUID } from '../models/uuid';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({});
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
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
    next({ message: err.message, statusCode: 400 });
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let id = req.params.id;
    if (!id) {
      throw new Error('user email is not supplied');
    }
    const userEmail = id.trim().toLowerCase();
    const userService = new UserService();
    const user = await userService.GetUserDetails(userEmail);
    res.status(200).json({ data: user });
  } catch (err) {
    next({ message: err.message, status: 488 });
  }
});

router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let id = req.params.id;
      if (!id) {
        throw new Error('user email must be provided');
      }

      const userEmail = id.trim().toLowerCase();
      const userService = new UserService();
      await userService.DeleteUser(userEmail);
      res.status(200).json({ data: { message: `${userEmail} deleted` } });
    } catch (err) {
      next({ message: err.message, statusCode: 400 });
    }
  }
);

router.post(
  '/:id/memberships',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { org_id } = req.body;
      const id = req.params.id;

      if (!org_id || !id) {
        throw new Error('org_id or user id is not defined');
      }

      const orgId = id.trim();
      const uuid = new UUID(orgId);

      if (!uuid.isValid()) {
        throw new Error('invalid org id');
      }

      const userEmail = id.trim().toLowerCase();
      const now = nowISO();
      const membership: IMembership = {
        user_email: userEmail,
        org_id,
        created_datetime: now,
        updated_datetime: now,
      };
      const userService = new UserService();
      await userService.CreateMembership(membership);
      res.status(200).json({ data: membership });
    } catch (err) {
      next({ message: err.message, statusCode: 400 });
    }
  }
);

router.get(
  '/:id/memberships',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userEmail = req.params.id;
      if (!userEmail) {
        throw new Error('user id not defined');
      }

      const emailLower = userEmail.trim().toLowerCase();
      const userService = new UserService();
      const memberships = await userService.GetMembershipsByUser(emailLower);

      res.status(200).json({ data: memberships });
    } catch (err) {
      next({ message: err.message, statusCode: 400 });
    }
  }
);

router.put(
  '/:id/memberships',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userEmail = req.params.id;
      let {
        org_id,
        can_accept_appointments,
        can_deny_appointments,
        can_edit_kennel_layout,
      } = req.body;

      if (!org_id || !userEmail) {
        throw new Error('org_id or user id is not defined');
      }

      const orgId = userEmail.trim();
      const uuid = new UUID(orgId);

      if (!uuid.isValid()) {
        throw new Error('invalid org id');
      }

      const emailLower = userEmail.trim().toLowerCase();
      const membership: IMembership = {
        org_id: orgId,
        user_email: emailLower,
        can_accept_appointments,
        can_deny_appointments,
        can_edit_kennel_layout,
        updated_datetime: nowISO(),
      };
      const userService = new UserService();
      const updatedMembership = await userService.UpdateMembership(membership);
      res.status(200).json(updatedMembership);
    } catch (err) {
      next({ message: err.message, statusCode: 400 });
    }
  }
);

router.delete(
  '/:id/memberships',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userEmail = req.params.id;
      const { org_id } = req.body;

      if (!org_id || !userEmail) {
        throw new Error('org_id or user id is not defined');
      }

      const orgId = userEmail.trim();
      const uuid = new UUID(orgId);

      if (!uuid.isValid()) {
        throw new Error('invalid org id');
      }

      const lowerEmail = userEmail.trim().toLowerCase();
      const userService = new UserService();
      await userService.DeleteMembership(orgId, lowerEmail);
      res.status(200).json({});
    } catch (err) {
      next({ message: err.message, statusCode: 400 });
    }
  }
);

module.exports = router;
