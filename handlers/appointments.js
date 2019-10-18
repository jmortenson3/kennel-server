const { nowISO } = require('../utils');
const { db } = require('../db');

exports.createAppointment = async (req, res, next) => {
  let branch_id = req.params.branch_id;
  const {
    appointment_type,
    dropoff_datetime,
    pickup_datetime,
    owner_email,
    pet_id,
    notes,
  } = req.body;

  if (!owner_email || !branch_id) {
    return next({
      error: 'owner_email or branch_id is not defined',
    });
  }

  try {
    let query =
      'INSERT INTO appointments ' +
      '(appointment_type, dropoff_datetime, pickup_datetime, owner_email, pet_id, created_datetime, updated_datetime, branch_id, notes) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ' +
      'RETURNING id;';
    const { rows } = await db.query(query, [
      appointment_type,
      dropoff_datetime,
      pickup_datetime,
      owner_email,
      pet_id,
      nowISO(),
      nowISO(),
      branch_id,
      notes,
    ]);
    res.status(200).json({ data: rows[0] });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

exports.getAppointment = async (req, res, next) => {
  const appointment_id = req.params.appointment_id;

  if (!appointment_id) {
    return next({ error: 'appointment_id is not defined' });
  }

  try {
    let query =
      'SELECT id, appointment_type, dropoff_datetime, pickup_datetime, owner_email, pet_id, created_datetime, updated_datetime, branch_id, notes ' +
      'FROM appointments ' +
      'WHERE id = $1;';
    const { rows } = await db.query(query, [appointment_id]);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getAppointmentsByOrganization = async (req, res, next) => {
  let organization_id = req.params.organization_id;

  try {
    let query =
      'SELECT ' +
      '  appt.id, ' +
      '  org.id organization_id, ' +
      '  appointment_type, ' +
      '  dropoff_datetime, ' +
      '  pickup_datetime, ' +
      '  owner_email, ' +
      '  pet_id, ' +
      '  appt.created_datetime, ' +
      '  appt.updated_datetime, ' +
      '  appt.branch_id, ' +
      '  notes ' +
      'FROM appointments appt, organizations org, branches bra ' +
      'WHERE ' +
      '  appt.branch_id = bra.id ' +
      '  and bra.organization_id = org.id ' +
      '  and org.id = $1;';
    const { rows } = await db.query(query, [organization_id]);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getAppointmentsByBranch = async (req, res, next) => {
  let branch_id = req.params.branch_id;

  try {
    let query =
      'SELECT ' +
      '  id, ' +
      '  appointment_type, ' +
      '  dropoff_datetime, ' +
      '  pickup_datetime, ' +
      '  owner_email, ' +
      '  pet_id, ' +
      '  created_datetime, ' +
      '  updated_datetime, ' +
      '  branch_id, ' +
      '  notes ' +
      'FROM appointments ' +
      'WHERE branch_id = $1;';
    const { rows } = await db.query(query, [branch_id]);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updateAppointment = async (req, res, next) => {
  const appointment_id = req.params.appointment_id;

  if (!appointment_id) {
    return next({ error: 'appointment_id is not defined' });
  }

  try {
    let {
      appointment_type,
      dropoff_datetime,
      pickup_datetime,
      owner_email,
      pet_id,
      branch_id,
      notes,
      status,
    } = req.body;

    let selectQuery =
      'SELECT id, appointment_type, dropoff_datetime, pickup_datetime, owner_email, pet_id, created_datetime, updated_datetime, branch_id, notes, status ' +
      'FROM appointments ' +
      'WHERE id = $1;';
    let selectResponse = await db.query(selectQuery, [appointment_id]);

    if (selectResponse.rows.length === 0) {
      return next({ error: 'appointment not found' });
    }

    let thisAppt = selectResponse.rows[0];
    appointment_type = appointment_type || thisAppt.appointment_type;
    dropoff_datetime = dropoff_datetime || thisAppt.dropoff_datetime;
    pickup_datetime = pickup_datetime || thisAppt.pickup_datetime;
    owner_email = owner_email || thisAppt.owner_email;
    pet_id = pet_id || thisAppt.pet_id;
    branch_id = branch_id || thisAppt.branch_id;
    notes = notes || thisAppt.notes;
    status = status || thisAppt.status;

    let updateQuery =
      'UPDATE appointments ' +
      'SET appointment_type = $2, dropoff_datetime = $3, pickup_datetime = $4, owner_email = $5, pet_id = $6, updated_datetime = $7, branch_id = $8, notes = $9, status = $10 ' +
      'WHERE id = $1;';
    let updatedDatetime = nowISO();
    let { rows } = await db.query(updateQuery, [
      appointment_id,
      appointment_type,
      dropoff_datetime,
      pickup_datetime,
      owner_email,
      pet_id,
      updatedDatetime,
      branch_id,
      notes,
      status,
    ]);
    res.status(200).json({
      appointment_id,
      appointment_type,
      dropoff_datetime,
      pickup_datetime,
      owner_email,
      pet_id,
      updatedDatetime,
      branch_id,
      notes,
      status,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

exports.deleteAppointment = async (req, res, next) => {
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
};
