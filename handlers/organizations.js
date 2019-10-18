const { nowISO } = require('../utils');
const { db } = require('../db');

exports.createOrganization = async (req, res, next) => {
  const { organization_name } = req.body;
  if (!organization_name) {
    return next({
      error: 'organization_name is not defined',
    });
  }
  try {
    let query =
      'INSERT INTO organizations ' +
      '(organization_name, created_datetime, updated_datetime) ' +
      'VALUES ($1, $2, $3) ' +
      'RETURNING id;';
    const { rows } = await db.query(query, [
      organization_name,
      nowISO(),
      nowISO(),
    ]);
    res.status(200).json({ data: rows[0] });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

exports.getOrganization = async (req, res, next) => {
  const organization_id = req.params.organization_id;

  if (!organization_id) {
    return next({ error: 'organization_id is not defined' });
  }

  try {
    let query =
      'SELECT id, organization_name, subdomain_name, created_datetime, updated_datetime ' +
      'FROM organizations ' +
      'WHERE id = $1;';
    const { rows } = await db.query(query, [organization_id]);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updateOrganization = async (req, res, next) => {
  const organization_id = req.params.organization_id;

  if (!organization_id) {
    return next({ error: 'organization_id is not defined' });
  }

  try {
    let { organization_name, subdomain_name } = req.body;

    let selectQuery =
      'SELECT id, organization_name, subdomain_name ' +
      'FROM organizations ' +
      'WHERE id = $1;';
    let selectResponse = await db.query(selectQuery, [organization_id]);

    if (selectResponse.rows.length === 0) {
      return next({ error: 'branch not found' });
    }

    let thisOrg = selectResponse.rows[0];
    organization_name = organization_name || thisOrg.organization_name;
    subdomain_name = subdomain_name || thisOrg.subdomain_name;

    let updateQuery =
      'UPDATE organizations ' +
      'SET organization_name = $2, subdomain_name = $3, updated_datetime = $4' +
      'WHERE id = $1;';
    let { rows } = await db.query(updateQuery, [
      organization_id,
      organization_name,
      subdomain_name,
      nowISO(),
    ]);
    res.status(200).json({
      organization_id,
      organization_name,
      subdomain_name,
      updated_datetime,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

exports.deleteOrganization = async (req, res, next) => {
  const organization_id = req.params.organization_id;

  if (!organization_id) {
    return next({ error: 'organization_id is not defined' });
  }

  try {
    let query = 'DELETE FROM organizations WHERE id = $1;';
    await db.query(query, [organization_id]);
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};
