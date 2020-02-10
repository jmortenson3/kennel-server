import { IAppointment } from '../interfaces/IAppointment';
import { nowISO, clone } from '../utils';
import Appointment from '../models/appointment';
import Location from '../models/location';
import Organization from '../models/organization';
import User from '../models/user';

export default class AppointmentService {
  constructor() {}

  public async CreateAppointment(appointment: IAppointment) {
    try {
      const appointmentModel: Appointment = clone(appointment);
      const now = nowISO();
      appointmentModel.created_datetime = now;
      appointmentModel.updated_datetime = now;
      const newAppointment = await Appointment.create(appointmentModel);
      return newAppointment;
    } catch (err) {
      throw err;
    }
  }

  public async GetAppointmentsByUser(userEmail: string) {
    try {
      if (!userEmail) {
        throw new Error('userEmail is undefined');
      }

      const cleansedUserEmail = userEmail.toLowerCase();
      const user = await User.findOne({ where: { email: cleansedUserEmail } });

      if (!user) {
        throw new Error('user not found');
      }

      const appointments = await user.getAppointments();
      return appointments;
    } catch (err) {
      throw err;
    }
  }

  public async GetAppointment(id: string) {
    try {
      const appointment = await Appointment.findOne({ where: { id } });

      if (!appointment) {
        throw new Error('appointment now found');
      }

      return appointment;
    } catch (err) {
      throw err;
    }
  }

  public async GetAppointmentsByLocation(id: string) {
    try {
      const location = await Location.findOne({ where: { id } });

      if (!location) {
        throw new Error('location not found');
      }

      const appointments = await location.getAppointments();
      return appointments;
    } catch (err) {
      throw err;
    }
  }

  public async GetAppointmentsByOrg(id: string) {
    try {
      const organization = await Organization.findOne({ where: { id } });

      if (!organization) {
        throw new Error('organization not found');
      }

      const appointments = await organization.getAppointments();
      return appointments;
    } catch (err) {
      throw err;
    }
  }

  public async UpdateAppointment(appointment: IAppointment) {
    try {
      const oldAppointment = await Appointment.findOne({
        where: { id: appointment.id },
      });

      if (!oldAppointment) {
        throw new Error('appointment not found');
      }

      const {
        user_email,
        status,
        pickup_datetime,
        dropoff_datetime,
        pet_id,
        notes,
        is_grooming,
        is_boarding,
        loc_id,
      } = Object.assign(<IAppointment>oldAppointment, appointment);

      const newAppointment = await oldAppointment.update({
        user_email,
        status,
        pickup_datetime,
        dropoff_datetime,
        pet_id,
        notes,
        is_grooming,
        is_boarding,
        loc_id,
        updated_datetime: nowISO(),
      });
      return newAppointment;
    } catch (err) {
      throw err;
    }
  }

  public async DeleteAppointment(id: string) {
    try {
      const appointment = await Appointment.findOne({ where: { id } });

      if (!appointment) {
        throw new Error('appointment not found');
      }

      await appointment.destroy();
    } catch (err) {
      throw err;
    }
  }
}
