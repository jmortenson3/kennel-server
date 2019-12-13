const router = require('express').Router();
const { nowISO } = require('../utils');
const { db } = require('../db');

// create appointment
router.post('/', async (req, res, next) => {
  const {
    is_boarding,
    is_grooming,
    location_id,
    dropoff_datetime,
    pickup_datetime,
    user_id,
    pet_id,
    notes,
  } = req.body;

  if (!user_id || !location_id) {
    return next({
      error: 'user_id or location_id is not defined',
    });
  }

  try {
    let query =
      'INSERT INTO appointments ' +
      '(is_boarding, is_grooming, dropoff_datetime, pickup_datetime, user_id, pet_id, created_datetime, updated_datetime, location_id, notes) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ' +
      'RETURNING id;';
    const { rows } = await db.query(query, [
      is_boarding,
      is_grooming,
      dropoff_datetime,
      pickup_datetime,
      user_id,
      pet_id,
      nowISO(),
      nowISO(),
      location_id,
      notes,
    ]);
    res.status(200).json({ data: rows[0] });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

router.get('/:appointment_id', async (req, res, next) => {
  const appointment_id = req.params.appointment_id;

  if (!appointment_id) {
    return next({ error: 'appointment_id is not defined' });
  }

  try {
    let query =
      'SELECT id, is_boarding, is_grooming, dropoff_datetime, pickup_datetime, user_id, pet_id, created_datetime, updated_datetime, location_id, notes ' +
      'FROM appointments ' +
      'WHERE id = $1;';
    const { rows } = await db.query(query, [appointment_id]);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get('/', async (req, res, next) => {
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
    '  location_id, ' +
    '  notes ' +
    'FROM appointments;';
  const { rows } = await db.query(query);
  return rows;
};

let getApptsByOrg = async org_id => {
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
    '  appt.location_id, ' +
    '  notes ' +
    'FROM appointments appt, organizations org, locations loc ' +
    'WHERE ' +
    '  appt.location_id = loc.id ' +
    '  and bra.org_id = org.id ' +
    '  and org.id = $1;';
  const { rows } = await db.query(query, [org_id]);
  return rows;
};

let getApptsByLoc = async loc_id => {
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
    'WHERE location_id = $1;';
  const { rows } = await db.query(query, [loc_id]);
  return rows;
};

router.put('/:appointment_id', async (req, res, next) => {
  const appointment_id = req.params.appointment_id;

  if (!appointment_id) {
    return next({ error: 'appointment_id is not defined' });
  }

  try {
    let {
      is_boarding,
      is_grooming,
      dropoff_datetime,
      pickup_datetime,
      user_email,
      pet_id,
      location_id,
      notes,
      status,
    } = req.body;

    let selectQuery =
      'SELECT id, is_boarding, is_grooming, dropoff_datetime, pickup_datetime, user_email, pet_id, created_datetime, updated_datetime, location_id, notes, status ' +
      'FROM appointments ' +
      'WHERE id = $1;';
    let selectResponse = await db.query(selectQuery, [appointment_id]);

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
    location_id = location_id || thisAppt.location_id;
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
      '  location_id = $9, ' +
      '  notes = $10, ' +
      '  status = $11 ' +
      'WHERE id = $1;';
    let updatedDatetime = nowISO();
    let { rows } = await db.query(updateQuery, [
      appointment_id,
      is_boarding,
      is_grooming,
      dropoff_datetime,
      pickup_datetime,
      user_email,
      pet_id,
      updatedDatetime,
      location_id,
      notes,
      status,
    ]);
    res.status(200).json({
      appointment_id,
      is_boarding,
      is_grooming,
      dropoff_datetime,
      pickup_datetime,
      user_email,
      pet_id,
      updatedDatetime,
      location_id,
      notes,
      status,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

router.delete('/:appointment_id', async (req, res, next) => {
  const appointment_id = req.params.appointment_id;

  if (!appointment_id) {
    return next({ error: 'appointment_id is not defined' });
  }

  try {
    let query = 'DELETE FROM appointments WHERE id = $1;';
    await db.query(query, [appointment_id]);
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
