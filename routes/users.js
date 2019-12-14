const router = require('express').Router();
const { nowISO } = require('../utils');
const { db } = require('../db');

router.get('/', async (req, res, next) => {
  try {
    let query =
      'SELECT email, created_datetime, updated_datetime ' + 'FROM users;';
    const { rows } = await db.query(query);
    res.status(200).json({ data: rows[0] });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    let id = req.params.id;
    if (!id) {
      return next({
        error: 'user email is not supplied',
      });
    }

    const cleansedId = id.trim().toLowerCase();

    let query =
      'SELECT email, created_datetime, updated_datetime ' +
      'FROM users ' +
      'WHERE email = $1;';
    const { rows } = await db.query(query, [cleansedId]);
    res.status(200).json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/memberships', async (req, res, next) => {
  const { org_id } = req.body;
  const id = req.params.id;

  if (!org_id || !id) {
    return next({
      error: 'org_id or user id is not defined',
    });
  }

  const userEmail = id.trim().toLowerCase();
  try {
    let query =
      'INSERT INTO organization_memberships ' +
      '(org_id, user_email, created_datetime, updated_datetime) ' +
      'VALUES ($1, $2, $3, $4) ' +
      'RETURNING org_id, user_email, created_datetime, updated_datetime;';
    const { rows } = await db.query(query, [
      org_id,
      userEmail,
      nowISO(),
      nowISO(),
    ]);
    res.status(200).json({ data: rows[0] });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

router.get('/:id/memberships', async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next({ error: 'user id not defined' });
  }

  try {
    const userEmail = id.trim().toLowerCase();
    let rows;

    if (req.query.org_id) {
      rows = await getMembershipsByOrg(userEmail, req.query.org_id);
    } else {
      rows = await getMemberships(userEmail);
    }

    res.status(200).json({ data: rows });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

let getMemberships = async userEmail => {
  let query =
    'SELECT org_id, user_email, can_accept_appointments, can_deny_appointments, can_edit_kennel_layout ' +
    'FROM organization_memberships ' +
    'WHERE user_email = $1;';
  const { rows } = await db.query(query, [userEmail]);
  return rows;
};

let getMembershipsByOrg = async (userEmail, orgId) => {
  let query =
    'SELECT org_id, user_email, can_accept_appointments, can_deny_appointments, can_edit_kennel_layout ' +
    'FROM organization_memberships ' +
    'WHERE user_email = $1 and org_id = $2;';
  const { rows } = await db.query(query, [userEmail, orgId]);
  return rows;
};

router.put('/:id/memberships', async (req, res, next) => {
  const id = req.params.id;
  let {
    org_id,
    can_accept_appointments,
    can_deny_appointments,
    can_edit_kennel_layout,
  } = req.body;

  if (!org_id || !id) {
    return next({
      error: 'org_id or user id is not defined',
    });
  }

  const userEmail = id.trim().toLowerCase();

  try {
    let selectQuery =
      'SELECT org_id, user_email, can_accept_appointments, can_deny_appointments, can_edit_kennel_layout ' +
      'FROM organization_memberships ' +
      'WHERE org_id = $1 AND user_email = $2;';
    let selectResponse = await db.query(selectQuery, [org_id, userEmail]);

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
      'WHERE org_id = $1 AND user_email = $2;';
    let { rows } = await db.query(updateQuery, [
      org_id,
      userEmail,
      can_accept_appointments,
      can_deny_appointments,
      can_edit_kennel_layout,
      nowISO(),
    ]);
    res.status(200).json({
      org_id,
      userEmail,
      can_accept_appointments,
      can_deny_appointments,
      can_edit_kennel_layout,
      updated_datetime: nowISO(),
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

router.delete('/:id/memberships', async (req, res, next) => {
  const id = req.params.id;
  const { org_id } = req.body;

  if (!org_id || !id) {
    return next({
      error: 'org_id or user id is not defined',
    });
  }

  const userEmail = id.trim().toLowerCase();

  try {
    let query =
      'DELETE FROM organization_memberships WHERE org_id = $1 AND user_email = $2;';
    await db.query(query, [org_id, userEmail]);
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
