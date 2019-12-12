const { nowISO } = require('../utils');
const { db } = require('../db');

exports.createMembership = async (req, res, next) => {
  const organization_id = req.params.organization_id;
  const { user_email } = req.body;

  if (!organization_id || !user_email) {
    return next({
      error: 'organization_id or user_email is not defined',
    });
  }
  try {
    let query =
      'INSERT INTO organization_memberships ' +
      '(organization_id, user_email, created_datetime, updated_datetime) ' +
      'VALUES ($1, $2, $3, $4) ' +
      'RETURNING organization_id, user_email, created_datetime, updated_datetime;';
    const { rows } = await db.query(query, [
      organization_id,
      user_email,
      nowISO(),
      nowISO(),
    ]);
    res.status(200).json({ data: rows[0] });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

exports.getMembership = async (req, res, next) => {
  const organization_id = req.params.organization_id;
  const { user_email } = req.body;

  if (!organization_id || !user_email) {
    return next({
      error: 'organization_id or user_email is not defined',
    });
  }

  try {
    let query =
      'SELECT * ' +
      'FROM organization_memberships ' +
      'WHERE organization_id = $1 AND user_email = $2;';
    const { rows } = await db.query(query, [organization_id, user_email]);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updateMembership = async (req, res, next) => {
  const organization_id = req.params.organization_id;
  const { user_email } = req.body;

  if (!organization_id || !user_email) {
    return next({
      error: 'organization_id or user_email is not defined',
    });
  }

  try {
    let {
      can_accept_appointments,
      can_deny_appointments,
      can_edit_kennel_layout,
    } = req.body;

    let selectQuery =
      'SELECT organization_id, user_email, can_accept_appointments, can_deny_appointments, can_edit_kennel_layout ' +
      'FROM organization_memberships ' +
      'WHERE organization_id = $1 AND user_email = $2;';
    let selectResponse = await db.query(selectQuery, [
      organization_id,
      user_email,
    ]);

    if (selectResponse.rows.length === 0) {
      return next({ error: 'membership not found' });
    }

    let thisMembership = selectResponse.rows[0];
    can_accept_appointments =
      can_accept_appointments || thisMembership.can_accept_appointments;
    can_deny_appointments =
      can_deny_appointments || thisMembership.can_deny_appointments;
    can_edit_kennel_layout =
      can_edit_kennel_layout || thisMembership.can_edit_kennel_layout;

    let updateQuery =
      'UPDATE organization_memberships ' +
      'SET can_accept_appointments = $3, can_deny_appointments = $4, can_edit_kennel_layout = $5, updated_datetime = $6' +
      'WHERE organization_id = $1 AND user_email = $2;';
    let { rows } = await db.query(updateQuery, [
      organization_id,
      user_email,
      can_accept_appointments,
      can_deny_appointments,
      can_edit_kennel_layout,
      nowISO(),
    ]);
    res.status(200).json({
      organization_id,
      user_email,
      can_accept_appointments,
      can_deny_appointments,
      can_edit_kennel_layout,
      updated_datetime: nowISO(),
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

exports.deleteMembership = async (req, res, next) => {
  const organization_id = req.params.organization_id;
  const { user_email } = req.body;
  if (!organization_id || !user_email) {
    return next({ error: 'organization_id or user_email is not defined' });
  }

  try {
    let query =
      'DELETE FROM organization_memberships WHERE organization_id = $1 AND user_email = $1;';
    await db.query(query, [organization_id, user_email]);
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};
