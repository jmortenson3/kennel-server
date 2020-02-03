import express, { Request, Response, NextFunction } from 'express';

import { nowISO } from '../utils';
import { OrganizationService } from '../services/organization';
import { IOrganization } from '../interfaces/IOrganization';
import { UUID } from '../models/uuid';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { org_name } = req.body;

    if (!org_name) {
      throw new Error('org_name is not defined');
    }

    const now = nowISO();

    const organization: IOrganization = {
      org_name: org_name.trim(),
      updated_datetime: now,
      created_datetime: now,
    };

    const organizationService = new OrganizationService();
    const newOrganization = await organizationService.CreateOrganization(
      organization
    );
    res.status(200).json({ data: newOrganization });
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationService = new OrganizationService();
    const organizations = await organizationService.GetOrganizations();
    res.status(200).json({ data: organizations });
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error('org id is not defined');
    }

    const orgId = id.trim();
    const uuid = new UUID(orgId);

    if (!uuid.isValid()) {
      throw new Error('invalid org id');
    }

    const organizationService = new OrganizationService();
    const organization = await organizationService.GetOrganization(orgId);
    res.status(200).json({ data: organization });
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error('org id is not defined');
    }

    const orgId = id.trim();
    const uuid = new UUID(orgId);

    if (!uuid.isValid()) {
      throw new Error('invalid org id');
    }

    let { org_name, subdomain_name } = req.body;

    const organization: IOrganization = {
      id: orgId,
      org_name: org_name ? org_name.trim() : org_name,
      subdomain_name: subdomain_name ? subdomain_name.trim() : undefined,
    };

    const organizationService = new OrganizationService();
    const newOrganization = await organizationService.UpdateOrganization(
      organization
    );

    res.status(200).json({ data: newOrganization });
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
  }
});

router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      if (!id) {
        throw new Error('org id is not defined');
      }

      const orgId = id.trim();
      const uuid = new UUID(orgId);

      if (!uuid.isValid()) {
        throw new Error('invalid org id');
      }

      const organizationService = new OrganizationService();
      await organizationService.DeleteOrganization(orgId);
      res.status(200).json({});
    } catch (err) {
      next({ message: err.message, statusCode: 400 });
    }
  }
);

module.exports = router;
