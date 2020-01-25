import express, { Request, Response, NextFunction } from 'express';
import { nowISO } from '../utils';
import db from '../db';
import { AppointmentService } from '../services/appointment';
import { IAppointment } from '../interfaces/IAppointment';

const router = express.Router();

// create appointment
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      is_boarding,
      is_grooming,
      loc_id,
      dropoff_datetime,
      pickup_datetime,
      user_email,
      pet_id,
      notes,
    } = req.body;

    if (!user_email || !loc_id) {
      throw new Error('user_email or loc_id is not defined');
    }

    const appointment: IAppointment = {
      is_boarding,
      is_grooming,
      loc_id,
      dropoff_datetime,
      pickup_datetime,
      user_email,
      pet_id,
      notes,
    };
    const appointmentService = new AppointmentService();
    const newAppointment = await appointmentService.CreateAppointment(
      appointment
    );
    res.status(200).json({ data: newAppointment });
  } catch (err) {
    next({ message: err, statusCode: 400 });
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!id) {
      return next({ error: 'appointment_id is not defined' });
    }

    const appointmentId = id.trim();
    const appointmentService = new AppointmentService();
    const appointments = await appointmentService.GetAppointment(appointmentId);
    res.status(200).json({ data: appointments });
  } catch (err) {
    next({ message: err, statusCode: 400 });
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  let appointments: IAppointment[];
  try {
    const appointmentService = new AppointmentService();
    if (req.query.loc_id) {
      appointments = await appointmentService.GetAppointmentsByLocation(
        req.query.loc_id
      );
    } else if (req.query.org_id) {
      appointments = await appointmentService.GetAppointmentsByOrg(
        req.query.org_id
      );
    } else {
      throw new Error('must specifiy search criteria, try by loc_id or org_id');
    }
    res.status(200).json({ data: appointments });
  } catch (err) {
    next({ message: err, statusCode: 400 });
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error('appointment id is not defined');
    }

    let {
      is_boarding,
      is_grooming,
      dropoff_datetime,
      pickup_datetime,
      user_email,
      pet_id,
      location_id: loc_id,
      notes,
      status,
    } = req.body;

    const appointment: IAppointment = {
      id: id.trim(),
      loc_id,
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
    next({ message: err, statusCode: 400 });
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
      const appointmentService = new AppointmentService();
      await appointmentService.DeleteAppointment(appointmentId);
    } catch (err) {
      next({ message: err, statusCode: 400 });
    }
  }
);

module.exports = router;
