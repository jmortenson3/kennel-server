const router = require('express').Router();
const { nowISO } = require('../utils');
const { db } = require('../db');

router.post('/', async (req, res, next) => {
  const { user_email, pet_name, birth_date, pet_type, breed } = req.body;
  if (!pet_name || !user_email) {
    return next({ error: 'user_email or pet_name is not defined' });
  }
  try {
    let query =
      'INSERT INTO pets ' +
      '(user_email, pet_name, birth_date, created_datetime, updated_datetime, pet_type, breed) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7) ' +
      'RETURNING id;';
    const { rows } = await db.query(query, [
      user_email.toLowerCase(),
      pet_name,
      birth_date,
      nowISO(),
      nowISO(),
      pet_type,
      breed,
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
    return next({ error: 'pet id is not defined' });
  }

  try {
    let query =
      'SELECT id, pet_name, user_email, birth_date, created_datetime, updated_datetime, pet_type, breed ' +
      'FROM pets ' +
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
    if (req.query.user_email) {
      rows = await getPetsByUser(req.query.user_email);
    } else {
      rows = await getPets();
    }

    res.status(200).json({ data: rows });
  } catch (err) {
    next(err);
  }
});

let getPets = async () => {
  let query =
    'SELECT id, pet_name, user_email, birth_date, created_datetime, updated_datetime, pet_type, breed ' +
    'FROM pets;';
  const { rows } = await db.query(query);
  return rows;
};

let getPetsByUser = async user_email => {
  let query =
    'SELECT id, pet_name, user_email, birth_date, created_datetime, updated_datetime, pet_type, breed ' +
    'FROM pets ' +
    'WHERE user_email = $1;';
  const { rows } = await db.query(query, [user_email]);
  return rows;
};

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next({ error: 'pet id is not defined' });
  }

  try {
    let { user_email, pet_name, birth_date, pet_type, breed } = req.body;

    let selectQuery =
      'SELECT id, pet_name, user_email, birth_date, created_datetime, updated_datetime, pet_type, breed ' +
      'FROM pets ' +
      'WHERE id = $1;';
    let selectResponse = await db.query(selectQuery, [id]);

    if (selectResponse.rows.length === 0) {
      return next({ error: 'pet not found' });
    }

    let thisPet = selectResponse.rows[0];
    user_email = user_email || thisPet.user_email;
    pet_name = pet_name || thisPet.pet_name;
    birth_date = birth_date || thisPet.birth_date;
    pet_type = pet_type || thisPet.pet_type;
    breed = breed || thisPet.breed;

    let updateQuery =
      'UPDATE pets ' +
      'SET user_email = $2, pet_name = $3, birth_date = $4, pet_type = $5, breed = $6 ' +
      'WHERE id = $1;';
    let { rows } = await db.query(updateQuery, [
      id,
      user_email.toLowerCase(),
      pet_name,
      birth_date,
      pet_type,
      breed,
    ]);
    res
      .status(200)
      .json({ id, user_email, pet_name, birth_date, pet_type, breed });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next({ error: 'pet id is not defined' });
  }

  try {
    let query = 'DELETE FROM pets WHERE id = $1;';
    await db.query(query, [id]);
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
