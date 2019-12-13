const router = require('express').Router();
const { nowISO } = require('../utils');
const { db } = require('../db');

router.post('/', async (req, res, next) => {
  const { loc_name, org_id } = req.body;
  if (!org_id || !loc_name) {
    return next({ error: 'org_id or loc_name is not defined' });
  }
  try {
    let query =
      'INSERT INTO locations ' +
      '(org_id, loc_name, created_datetime, updated_datetime) ' +
      'VALUES ($1, $2, $3, $4) ' +
      'RETURNING id;';
    const { rows } = await db.query(query, [
      org_id,
      loc_name,
      nowISO(),
      nowISO(),
    ]);
    res.status(200).json({ data: rows[0] });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next({ error: 'location id is not defined' });
  }

  try {
    let query =
      'SELECT id, org_id, loc_name, created_datetime, updated_datetime ' +
      'FROM locations ' +
      'WHERE id = $1;';
    const { rows } = await db.query(query, [id]);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    let rows;
    if (req.query.org_id) {
      rows = await getLocByOrg(org_id);
    } else {
      rows = await getLocs();
    }
    res.status(200).json({ data: rows });
  } catch (err) {
    next(err);
  }
});

let getLocs = async org_id => {
  let query =
    'SELECT id, org_id, loc_name, created_datetime, updated_datetime ' +
    'FROM locations;';
  const { rows } = await db.query(query, [org_id]);
  return rows;
};

let getLocByOrg = async org_id => {
  let query =
    'SELECT id, org_id, loc_name, created_datetime, updated_datetime ' +
    'FROM locations ' +
    'WHERE org_id = $1;';
  const { rows } = await db.query(query, [org_id]);
  return rows;
};

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next({ error: 'location id is not defined' });
  }

  try {
    let { loc_name } = req.body;

    let selectQuery =
      'SELECT id, org_id, loc_name ' + 'FROM locations ' + 'WHERE id = $1;';
    let selectResponse = await db.query(selectQuery, [id]);

    if (selectResponse.rows.length === 0) {
      return next({ error: 'location not found' });
    }

    let thisPet = selectResponse.rows[0];
    loc_name = loc_name || thisPet.loc_name;

    let updateQuery =
      'UPDATE locations ' +
      'SET loc_name = $2, updated_datetime = $3' +
      'WHERE id = $1;';
    let { rows } = await db.query(updateQuery, [id, loc_name, nowISO()]);
    res.status(200).json({ id, updated_datetime });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const id = req.params.location_id;

  if (!id) {
    return next({ error: 'location id is not defined' });
  }

  try {
    let query = 'DELETE FROM locations WHERE id = $1;';
    await db.query(query, [id]);
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
