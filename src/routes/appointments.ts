import express, { Request, Response, NextFunction } from 'express';
import { nowISO } from '../utils';
import db from '../db';

const router = express.Router();

// create appointment
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
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
    return next({
      error: 'user_email or loc_id is not defined',
    });
  }

  try {
    let query =
      'INSERT INTO appointments ' +
      '(is_boarding, is_grooming, dropoff_datetime, pickup_datetime, user_email, pet_id, created_datetime, updated_datetime, loc_id, notes) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ' +
      'RETURNING id;';
    const { rows } = await db.query(query, [
      is_boarding,
      is_grooming,
      dropoff_datetime,
      pickup_datetime,
      user_email,
      pet_id,
      nowISO(),
      nowISO(),
      loc_id,
      notes,
    ]);
    res.status(200).json({ data: rows[0] });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  if (!id) {
    return next({ error: 'appointment_id is not defined' });
  }

  try {
    let query =
      'SELECT id, is_boarding, is_grooming, dropoff_datetime, pickup_datetime, user_id, pet_id, created_datetime, updated_datetime, loc_id, notes ' +
      'FROM appointments ' +
      'WHERE id = $1;';
    const { rows } = await db.query(query, [id]);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  let rows;
  try {
    if (req.query.loc_id) {
      rows = await getApptsByLoc(req.query.loc_id);
    } else if (req.query.org_id) {
      rows = await getApptsByOrg(req.query.org_id);
    } else {
      rows = await getAppts();
    }
    res.status(200).json({ data: rows });
  } catch (err) {
    next(err);
  }
});

let getAppts = async () => {
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
    '  loc_id, ' +
    '  notes ' +
    'FROM appointments;';
  const { rows } = await db.query(query);
  return rows;
};

let getApptsByOrg = async (org_id: string) => {
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
  const { rows } = await db.query(query, [org_id]);
  return rows;
};

let getApptsByLoc = async (loc_id: string) => {
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
  const { rows } = await db.query(query, [loc_id]);
  return rows;
};

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  if (!id) {
    return next({ error: 'appointment id is not defined' });
  }

  try {
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

    let selectQuery =
      'SELECT id, is_boarding, is_grooming, dropoff_datetime, pickup_datetime, user_email, pet_id, created_datetime, updated_datetime, loc_id, notes, status ' +
      'FROM appointments ' +
      'WHERE id = $1;';
    let selectResponse = await db.query(selectQuery, [id]);

    if (selectResponse.rows.length === 0) {
      return next({ error: 'appointment not found' });
    }

    let thisAppt = selectResponse.rows[0];
    is_boarding = is_boarding || thisAppt.is_boarding;
    is_grooming = is_grooming || thisAppt.is_grooming;
    dropoff_datetime = dropoff_datetime || thisAppt.dropoff_datetime;
    pickup_datetime = pickup_datetime || thisAppt.pickup_datetime;
    user_email = user_email || thisAppt.user_email;
    pet_id = pet_id || thisAppt.pet_id;
    loc_id = loc_id || thisAppt.loc_id;
    notes = notes || thisAppt.notes;
    status = status || thisAppt.status;

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
    let updatedDatetime = nowISO();
    let { rows } = await db.query(updateQuery, [
      id,
      is_boarding,
      is_grooming,
      dropoff_datetime,
      pickup_datetime,
      user_email,
      pet_id,
      updatedDatetime,
      loc_id,
      notes,
      status,
    ]);
    res.status(200).json({
      id,
      is_boarding,
      is_grooming,
      dropoff_datetime,
      pickup_datetime,
      user_email,
      pet_id,
      updatedDatetime,
      loc_id,
      notes,
      status,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!id) {
      return next({ error: 'appointment id is not defined' });
    }

    try {
      let query = 'DELETE FROM appointments WHERE id = $1;';
      await db.query(query, [id]);
      res.status(200).json({});
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
