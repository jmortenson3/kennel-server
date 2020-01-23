import express, { Request, Response, NextFunction } from 'express';

import { nowISO } from '../utils';
import db from '../db';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { organization_name: org_name } = req.body;
  if (!org_name) {
    return next({
      error: 'org_name is not defined',
    });
  }
  try {
    let query =
      'INSERT INTO organizations ' +
      '(org_name, created_datetime, updated_datetime) ' +
      'VALUES ($1, $2, $3) ' +
      'RETURNING id;';
    const { rows } = await db.query(query, [org_name, nowISO(), nowISO()]);
    res.status(200).json({ data: rows[0] });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  if (!id) {
    return next({ error: 'org id is not defined' });
  }

  try {
    let query =
      'SELECT id, org_name, subdomain_name, created_datetime, updated_datetime ' +
      'FROM organizations ' +
      'WHERE id = $1;';
    const { rows } = await db.query(query, [id]);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.org_id;

  if (!id) {
    return next({ error: 'org id is not defined' });
  }

  try {
    let { org_name, subdomain_name } = req.body;

    let selectQuery =
      'SELECT id, org_name, subdomain_name ' +
      'FROM organizations ' +
      'WHERE id = $1;';

    let orgQueryResult = await db.query(selectQuery, [id]);

    if (orgQueryResult.rows.length === 0) {
      return next({ error: 'org not found' });
    }

    let thisOrg = orgQueryResult.rows[0];
    org_name = org_name || thisOrg.org_name;
    subdomain_name = subdomain_name || thisOrg.subdomain_name;
    let updated_datetime = nowISO();

    let updateQuery =
      'UPDATE organizations ' +
      'SET org_name = $2, subdomain_name = $3, updated_datetime = $4' +
      'WHERE id = $1;';
    let { rows } = await db.query(updateQuery, [
      id,
      org_name,
      subdomain_name,
      updated_datetime,
    ]);
    res.status(200).json({
      id,
      org_name,
      subdomain_name,
      updated_datetime,
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
      return next({ error: 'org id is not defined' });
    }

    try {
      let query = 'DELETE FROM organizations WHERE id = $1;';
      await db.query(query, [id]);
      res.status(200).json({});
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
