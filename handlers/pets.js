const { nowISO } = require('../utils');
const { db } = require('../db');

exports.createPet = async (req, res, next) => {
  const { owner_email, pet_name, birth_date, pet_type, breed } = req.body;
  if (!pet_name || !owner_email) {
    return next({ error: 'user_email is not defined' });
  }
  try {
    let query =
      'INSERT INTO pets ' +
      '(owner_email, pet_name, birth_date, created_datetime, updated_datetime, pet_type, breed) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7) ' +
      'RETURNING id;';
    const { rows } = await db.query(query, [
      owner_email.toLowerCase(),
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
};

exports.getPet = async (req, res, next) => {
  const pet_id = req.params.pet_id;

  if (!pet_id) {
    return next({ error: 'pet_id is not defined' });
  }

  try {
    let query =
      'SELECT id, pet_name, birth_date, created_datetime, updated_datetime, pet_type, breed ' +
      'FROM pets ' +
      'WHERE id = $1;';
    const { rows } = await db.query(query, [pet_id]);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getOwnersPets = async (req, res, next) => {
  const user_email = req.params.user_email;

  if (!user_email) {
    return next({ error: 'user_email is not defined' });
  }

  try {
    let query =
      'SELECT id, pet_name, birth_date, created_datetime, updated_datetime, pet_type, breed ' +
      'FROM pets ' +
      'WHERE owner_email = $1;';
    const { rows } = await db.query(query, [user_email]);
    res.status(200).json({ data: rows });
  } catch (err) {
    next(err);
  }
};

exports.updatePet = async (req, res, next) => {
  const pet_id = req.params.pet_id;

  if (!pet_id) {
    return next({ error: 'pet_id is not defined' });
  }

  try {
    let { owner_email, pet_name, birth_date, pet_type, breed } = req.body;

    let selectQuery =
      'SELECT id, pet_name, birth_date, created_datetime, updated_datetime, pet_type, breed ' +
      'FROM pets ' +
      'WHERE id = $1;';
    let selectResponse = await db.query(selectQuery, [pet_id]);

    if (selectResponse.rows.length === 0) {
      return next({ error: 'pet not found' });
    }

    let thisPet = selectResponse.rows[0];
    owner_email = owner_email || thisPet.owner_email;
    pet_name = pet_name || thisPet.pet_name;
    birth_date = birth_date || thisPet.birth_date;
    pet_type = pet_type || thisPet.pet_type;
    breed = breed || thisPet.breed;

    let updateQuery =
      'UPDATE pets ' +
      'SET owner_email = $2, pet_name = $3, birth_date = $4, pet_type = $5, breed = $6 ' +
      'WHERE id = $1;';
    let { rows } = await db.query(updateQuery, [
      pet_id,
      owner_email.toLowerCase(),
      pet_name,
      birth_date,
      pet_type,
      breed,
    ]);
    res
      .status(200)
      .json({ pet_id, owner_email, pet_name, birth_date, pet_type, breed });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

exports.deletePet = async (req, res, next) => {
  const pet_id = req.params.pet_id;

  if (!pet_id) {
    return next({ error: 'pet_id is not defined' });
  }

  try {
    let query = 'DELETE FROM pets WHERE id = $1;';
    await db.query(query, [pet_id]);
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};
