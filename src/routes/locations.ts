import express, { Request, Response, NextFunction } from 'express';

import { ILocation } from '../interfaces/ILocation';
import { LocationService } from '../services/location';
import { UUID } from '../models/uuid';
import Location from '../models/location';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { loc_name, org_id } = req.body;

    if (!org_id || !loc_name) {
      throw new Error('org_id or loc_name is not defined');
    }

    const orgId = org_id.trim();
    const uuid = new UUID(orgId);

    if (!uuid.isValid()) {
      throw new Error('invalid org id');
    }

    const locName = loc_name.trim();
    const locationService = new LocationService();
    const location = await locationService.CreateLocation({
      org_id: orgId,
      loc_name: locName,
    });
    res.status(200).json({ data: location });
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error('location id is not defined');
    }

    const locationId = id.trim();
    const uuid = new UUID(locationId);

    if (!uuid.isValid()) {
      throw new Error('invalid org id');
    }
    const locationService = new LocationService();
    const location = await locationService.GetLocation(locationId);
    res.status(200).json({ data: location });
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let locations: Location[];
    const locationService = new LocationService();
    if (req.query.org_id) {
      const orgId = req.query.org_id.trim();
      const orgUuid = new UUID(orgId);

      if (!orgUuid.isValid()) {
        throw new Error('invalid org id');
      }

      locations = await locationService.GetLocationsByOrgId(orgId);
    } else {
      locations = await locationService.GetLocations();
    }

    res.status(200).json({ data: locations });
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { org_id, loc_name } = req.body;

    if (!id || !org_id) {
      throw new Error('location id or org_id is not defined');
    }

    const locationId = id.trim();
    const locUuid = new UUID(locationId);

    if (!locUuid.isValid()) {
      throw new Error('invalid loc id');
    }

    const orgId = org_id.trim();
    const orgUuid = new UUID(orgId);

    if (!orgUuid.isValid()) {
      throw new Error('invalid org id');
    }

    const locName = loc_name ? loc_name.trim() : loc_name;
    const location: ILocation = {
      id: locationId,
      org_id: orgId,
      loc_name: locName,
    };
    const locationService = new LocationService();
    const newLocation = await locationService.UpdateLocation(location);
    res.status(200).json({ data: newLocation });
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
  }
});

router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const { org_id } = req.body;

      if (!id) {
        throw new Error('location id is not defined');
      }

      const locationId = id.trim();
      const locUuid = new UUID(locationId);

      if (!locUuid.isValid()) {
        throw new Error('invalid loc id');
      }

      const orgId = org_id.trim();
      const orgUuid = new UUID(orgId);

      if (!orgUuid.isValid()) {
        throw new Error('invalid org id');
      }

      const locationService = new LocationService();
      await locationService.DeleteLocation(locationId, orgId);
      res.status(200).json({});
    } catch (err) {
      next({ message: err.message, statusCode: 400 });
    }
  }
);

module.exports = router;
