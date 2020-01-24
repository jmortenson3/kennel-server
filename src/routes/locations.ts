import express, { Request, Response, NextFunction } from 'express';

import { ILocation } from '../interfaces/ILocation';
import { nowISO } from '../utils';
import db from '../db';
import { LocationService } from '../services/location';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { loc_name, org_id } = req.body;

    if (!org_id || !loc_name) {
      throw new Error('org_id or loc_name is not defined');
    }

    const locationService = new LocationService();
    const orgId = org_id.trim();
    const locName = loc_name.trim();
    const location = await locationService.CreateLocation(locName, orgId);
    res.status(200).json({ data: location });
  } catch (err) {
    next({ message: err, statusCode: 400 });
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error('location id is not defined');
    }

    const locationId = id.trim();
    const locationService = new LocationService();
    const location = await locationService.GetLocation(locationId);
    res.status(200).json({ data: location });
  } catch (err) {
    console.log(err);
    next({ message: err, statusCode: 400 });
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.query.org_id) {
      throw new Error('must specifiy org_id in query');
    }
    const orgId = req.query.org_id.trim();
    const locationService = new LocationService();
    const locations = await locationService.GetLocationsByOrgId(orgId);
    res.status(200).json({ data: locations });
  } catch (err) {
    next({ message: err, statusCode: 400 });
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { org_id, loc_name } = req.body;

    if (!id || !org_id) {
      throw new Error('location id or org_id is not defined');
    }
    const locId = id.trim();
    const orgId = org_id.trim();
    const locName = loc_name.trim();
    const location: ILocation = {
      id: locId,
      org_id: orgId,
      loc_name: locName,
    };
    const locationService = new LocationService();
    const newLocation = await locationService.UpdateLocation(location);
    res.status(200).json({ data: newLocation });
  } catch (err) {
    next({ message: err, statusCode: 400 });
  }
});

router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.location_id;
      const { org_id } = req.body;

      if (!id) {
        throw new Error('location id is not defined');
      }
      const locId = id.trim();
      const orgId = org_id.trim();
      const location: ILocation = {
        id: locId,
        org_id: orgId,
      };
      const locationService = new LocationService();
      await locationService.DeleteLocation(location);
      res.status(200).json({});
    } catch (err) {
      next({ message: err, statusCode: 400 });
    }
  }
);

module.exports = router;
