import express, { Request, Response, NextFunction } from 'express';

import AppointmentService from '../services/appointment';
import { IAppointment } from '../interfaces/IAppointment';
import { isValidUUID } from '../utils';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      is_boarding,
      is_grooming,
      org_id,
      loc_id,
      dropoff_datetime,
      pickup_datetime,
      user_email,
      pet_id,
      notes,
    } = req.body;

    if (!user_email || !loc_id || !org_id) {
      throw new Error('user_email or loc_id or org_id is not defined');
    }

    const locationId = loc_id.trim();
    if (!isValidUUID(locationId)) {
      throw new Error('invalid location id');
    }

    const orgId = org_id.trim();
    if (!isValidUUID(orgId)) {
      throw new Error('invalid org id');
    }

    const petId = pet_id.trim();
    if (!isValidUUID(petId)) {
      throw new Error('invalid pet id');
    }

    const appointment: IAppointment = {
      is_boarding,
      is_grooming,
      org_id: orgId,
      loc_id: locationId,
      dropoff_datetime,
      pickup_datetime,
      user_email,
      pet_id: petId,
      notes,
    };
    const appointmentService = new AppointmentService();
    const newAppointment = await appointmentService.CreateAppointment(
      appointment
    );
    res.status(200).json({ data: newAppointment });
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error('appointment_id is not defined');
    }

    const appointmentId = id.trim();

    if (!isValidUUID(appointmentId)) {
      throw new Error('invalid org id');
    }

    const appointmentService = new AppointmentService();
    const appointments = await appointmentService.GetAppointment(appointmentId);
    res.status(200).json({ data: appointments });
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  let appointments: IAppointment[];
  try {
    const appointmentService = new AppointmentService();

    if (req.query.loc_id) {
      const locId = req.query.loc_id.trim();
      if (!isValidUUID(locId)) {
        throw new Error('invalid loc id');
      }
      appointments = await appointmentService.GetAppointmentsByLocation(locId);
    } else if (req.query.org_id) {
      const orgId = req.query.org_id.trim();
      if (!isValidUUID(orgId)) {
        throw new Error('invalid org id');
      }
      appointments = await appointmentService.GetAppointmentsByOrg(orgId);
    } else if (req.query.user_email) {
      const userEmail: string = req.query.user_email;
      const emailLower = userEmail.trim().toLowerCase();
      appointments = await appointmentService.GetAppointmentsByUser(emailLower);
    } else {
      throw new Error(
        'must specifiy search criteria, try by loc_id, user_email, or org_id'
      );
    }
    res.status(200).json({ data: appointments });
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error('appointment id is not defined');
    }

    const appointmentId = id.trim();
    if (!isValidUUID(appointmentId)) {
      throw new Error('invalid appointment id');
    }

    let {
      is_boarding,
      is_grooming,
      dropoff_datetime,
      pickup_datetime,
      user_email,
      pet_id,
      location_id: loc_id,
      org_id,
      notes,
      status,
    } = req.body;

    const appointment: IAppointment = {
      id: appointmentId,
      loc_id,
      org_id,
      is_boarding,
      is_grooming,
      notes,
      pet_id,
      dropoff_datetime,
      pickup_datetime,
      status,
      user_email,
    };

    const appointmentService = new AppointmentService();
    const updatedAppointment = await appointmentService.UpdateAppointment(
      appointment
    );

    res.status(200).json({ data: updatedAppointment });
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
        throw new Error('appointment id is not defined');
      }

      const appointmentId = id.trim();
      if (!isValidUUID(appointmentId)) {
        throw new Error('invalid org id');
      }

      const appointmentService = new AppointmentService();
      await appointmentService.DeleteAppointment(appointmentId);
      res.status(200).send({});
    } catch (err) {
      next({ message: err.message, statusCode: 400 });
    }
  }
);

module.exports = router;
