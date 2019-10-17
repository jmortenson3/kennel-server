const { nowISO } = require('../utils');
const { db } = require('../db');

exports.createBranch = async (req, res, next) => {
  const organization_id = req.params.organization_id;
  const { branch_name } = req.body;
  if (!organization_id || !branch_name) {
    return next({ error: 'organization_id or branch_name is not defined' });
  }
  try {
    let query =
      'INSERT INTO branches ' +
      '(organization_id, branch_name, created_datetime, updated_datetime) ' +
      'VALUES ($1, $2, $3, $4) ' +
      'RETURNING id;';
    const { rows } = await db.query(query, [
      organization_id,
      branch_name,
      nowISO(),
      nowISO(),
    ]);
    res.status(200).json({ data: rows[0] });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

exports.getBranch = async (req, res, next) => {
  const branch_id = req.params.branch_id;

  if (!branch_id) {
    return next({ error: 'branch_id is not defined' });
  }

  try {
    let query =
      'SELECT id, organization_id, branch_name, created_datetime, updated_datetime ' +
      'FROM branches ' +
      'WHERE id = $1;';
    const { rows } = await db.query(query, [branch_id]);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getOrganizationsBranches = async (req, res, next) => {
  const organization_id = req.params.organization_id;

  if (!organization_id) {
    return next({ error: 'organization_id is not defined' });
  }

  try {
    let query =
      'SELECT id, organization_id, branch_name, created_datetime, updated_datetime ' +
      'FROM branches ' +
      'WHERE organization_id = $1;';
    const { rows } = await db.query(query, [organization_id]);
    res.status(200).json({ data: rows });
  } catch (err) {
    next(err);
  }
};

exports.updateBranch = async (req, res, next) => {
  const branch_id = req.params.branch_id;

  if (!branch_id) {
    return next({ error: 'branch_id is not defined' });
  }

  try {
    let { branch_name } = req.body;

    let selectQuery =
      'SELECT id, organization_id, branch_name ' +
      'FROM branches ' +
      'WHERE id = $1;';
    let selectResponse = await db.query(selectQuery, [branch_id]);

    if (selectResponse.rows.length === 0) {
      return next({ error: 'branch not found' });
    }

    let thisPet = selectResponse.rows[0];
    branch_name = branch_name || thisPet.branch_name;

    let updateQuery =
      'UPDATE branches ' +
      'SET branch_name = $2, updated_datetime = $3' +
      'WHERE id = $1;';
    let { rows } = await db.query(updateQuery, [
      branch_id,
      branch_name,
      nowISO(),
    ]);
    res.status(200).json({ branch_id, updated_datetime });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

exports.deleteBranch = async (req, res, next) => {
  const branch_id = req.params.branch_id;

  if (!branch_id) {
    return next({ error: 'branch_id is not defined' });
  }

  try {
    let query = 'DELETE FROM branches WHERE id = $1;';
    await db.query(query, [branch_id]);
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};
