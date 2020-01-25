import { IAppointment } from '../interfaces/IAppointment';
import db from '../db';
import { nowISO } from '../utils';

export class AppointmentService {
  constructor() {}

  public async CreateAppointment(appointment: IAppointment) {
    try {
      const newAppointment = JSON.parse(JSON.stringify(appointment));
      let query =
        'INSERT INTO appointments ' +
        '(is_boarding, is_grooming, dropoff_datetime, pickup_datetime, user_email, pet_id, created_datetime, updated_datetime, loc_id, notes) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ' +
        'RETURNING id;';
      let now = nowISO();
      newAppointment.created_datetime = now;
      newAppointment.updated_datetime = now;
      const { rows } = await db.query(query, [
        newAppointment.is_boarding,
        newAppointment.is_grooming,
        newAppointment.dropoff_datetime,
        newAppointment.pickup_datetime,
        newAppointment.user_email,
        newAppointment.pet_id,
        newAppointment.created_datetime,
        newAppointment.updated_datetime,
        newAppointment.loc_id,
        newAppointment.notes,
      ]);
      newAppointment.id = rows[0].id;
      return newAppointment;
    } catch (err) {
      throw err;
    }
  }

  public async GetAppointment(appointmentId: string) {
    try {
      let query =
        'SELECT id, is_boarding, is_grooming, dropoff_datetime, pickup_datetime, user_id, pet_id, created_datetime, updated_datetime, loc_id, notes ' +
        'FROM appointments ' +
        'WHERE id = $1;';
      const { rows } = await db.query(query, [appointmentId]);
      const appointments = rows.map(row => {
        const appointment: IAppointment = {
          id: row.id,
          loc_id: row.loc_id,
          is_boarding: row.is_boarding,
          is_grooming: row.is_grooming,
          dropoff_datetime: row.dropoff_datetime,
          pickup_datetime: row.pickup_datetime,
          user_email: row.user_email,
          pet_id: row.pet_id,
          notes: row.notes,
        };
        return appointment;
      });
      return appointments;
    } catch (err) {
      throw err;
    }
  }

  public async GetAppointmentsByLocation(locationId: string) {
    let query =
      'SELECT ' +
      '  id, ' +
      '  is_boarding, ' +
      '  is_grooming, ' +
      '  dropoff_datetime, ' +
      '  pickup_datetime, ' +
      '  user_email, ' +
      '  pet_id, ' +
      '  created_datetime, ' +
      '  updated_datetime, ' +
      '  location_id, ' +
      '  notes ' +
      'FROM appointments ' +
      'WHERE loc_id = $1;';
    const { rows } = await db.query(query, [locationId]);

    const appointments = rows.map(row => {
      const appointment: IAppointment = {
        id: row.id,
        loc_id: row.loc_id,
        is_boarding: row.is_boarding,
        is_grooming: row.is_grooming,
        dropoff_datetime: row.dropoff_datetime,
        pickup_datetime: row.pickup_datetime,
        user_email: row.user_email,
        pet_id: row.pet_id,
        notes: row.notes,
      };
      return appointment;
    });
    return appointments;
  }

  public async GetAppointmentsByOrg(orgId: string) {
    try {
      let query =
        'SELECT ' +
        '  appt.id, ' +
        '  org.id org_id, ' +
        '  is_boarding, ' +
        '  is_grooming, ' +
        '  dropoff_datetime, ' +
        '  pickup_datetime, ' +
        '  user_email, ' +
        '  pet_id, ' +
        '  appt.created_datetime, ' +
        '  appt.updated_datetime, ' +
        '  appt.loc_id, ' +
        '  notes ' +
        'FROM appointments appt, organizations org, locations loc ' +
        'WHERE ' +
        '  appt.loc_ id = loc.id ' +
        '  and bra.org_id = org.id ' +
        '  and org.id = $1;';
      const { rows } = await db.query(query, [orgId]);
      const appointments = rows.map(row => {
        const appointment: IAppointment = {
          id: row.id,
          loc_id: row.loc_id,
          is_boarding: row.is_boarding,
          is_grooming: row.is_grooming,
          dropoff_datetime: row.dropoff_datetime,
          pickup_datetime: row.pickup_datetime,
          user_email: row.user_email,
          pet_id: row.pet_id,
          notes: row.notes,
        };
        return appointment;
      });
      return appointments;
    } catch (err) {
      throw err;
    }
  }

  public async UpdateAppointment(appointment: IAppointment) {
    try {
      let selectQuery =
        'SELECT id, is_boarding, is_grooming, dropoff_datetime, pickup_datetime, user_email, pet_id, created_datetime, updated_datetime, loc_id, notes, status ' +
        'FROM appointments ' +
        'WHERE id = $1;';
      let selectResponse = await db.query(selectQuery, [appointment.id]);

      if (selectResponse.rows.length === 0) {
        throw new Error('appointment not found');
      }

      const oldAppointment = <IAppointment>selectResponse.rows[0];
      let newAppointment: IAppointment = Object.assign(
        oldAppointment,
        appointment
      );
      newAppointment.updated_datetime = nowISO();

      let updateQuery =
        'UPDATE appointments ' +
        'SET ' +
        '  is_boarding = $2, ' +
        '  is_grooming = $3, ' +
        '  dropoff_datetime = $4, ' +
        '  pickup_datetime = $5, ' +
        '  user_email = $6, ' +
        '  pet_id = $7, ' +
        '  updated_datetime = $8, ' +
        '  loc_id = $9, ' +
        '  notes = $10, ' +
        '  status = $11 ' +
        'WHERE id = $1;';

      const {
        id,
        user_email,
        status,
        pickup_datetime,
        dropoff_datetime,
        pet_id,
        notes,
        is_grooming,
        is_boarding,
        loc_id,
        updated_datetime,
      } = appointment;

      const queryParams = [
        id,
        is_boarding,
        is_grooming,
        dropoff_datetime,
        pickup_datetime,
        user_email,
        pet_id,
        updated_datetime,
        loc_id,
        notes,
        status,
      ];

      await db.query(updateQuery, queryParams);
      return newAppointment;
    } catch (err) {
      throw err;
    }
  }

  public async DeleteAppointment(appointmentId: string) {
    try {
      let query = 'DELETE FROM appointments WHERE id = $1;';
      await db.query(query, [appointmentId]);
    } catch (err) {
      throw err;
    }
  }
}
