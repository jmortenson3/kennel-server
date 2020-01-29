import express, { Request, Response, NextFunction } from 'express';

import { nowISO } from '../utils';
import db from '../db';
import { OrganizationService } from '../services/organization';
import { IOrganization } from '../interfaces/IOrganization';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { organization_name: org_name } = req.body;

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
    next({ message: err, statusCode: 400 });
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error('org id is not defined');
    }

    const organizationService = new OrganizationService();
    const appointment = await organizationService.GetOrganization(id);
    res.status(200).json({ data: appointment });
  } catch (err) {
    next({ message: err, statusCode: 400 });
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.org_id;

    if (!id) {
      throw new Error('org id is not defined');
    }

    let { org_name, subdomain_name } = req.body;

    const organization: IOrganization = {
      id: id.trim(),
      org_name: org_name.trim(),
      subdomain_name: subdomain_name.trim(),
    };

    const organizationService = new OrganizationService();
    const newOrganization = await organizationService.UpdateOrganization(
      organization
    );

    res.status(200).json({ data: newOrganization });
  } catch (err) {
    next({ message: err, statusCode: 400 });
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

      const organizationService = new OrganizationService();
      await organizationService.DeleteOrganization(id);
      res.status(200).json({});
    } catch (err) {
      next({ message: err, statusCode: 400 });
    }
  }
);

module.exports = router;
