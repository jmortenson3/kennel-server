import db from '../db';
import { ILocation } from '../interfaces/ILocation';
import { nowISO } from '../utils';

export class LocationService {
  constructor() {}

  public async GetLocation(location_id: string) {
    try {
      let query =
        'SELECT id, org_id, loc_name, created_datetime, updated_datetime ' +
        'FROM locations ' +
        'WHERE id = $1;';
      const { rows } = await db.query(query, [location_id]);
      const location: ILocation = {
        id: rows[0].id,
        org_id: rows[0].org_id,
        loc_name: rows[0].loc_name,
        created_datetime: rows[0].created_datetime,
        updated_datetime: rows[0].updated_datetime,
      };
      return location;
    } catch (err) {
      throw err;
    }
  }

  public async GetLocationsByOrgId(orgId: string) {
    try {
      let query =
        'SELECT id, org_id, loc_name, created_datetime, updated_datetime ' +
        'FROM locations ' +
        'WHERE org_id = $1;';
      const { rows } = await db.query(query, [orgId]);
      const locations = rows.map(row => {
        const location: ILocation = {
          id: row.id,
          org_id: row.org_id,
          loc_name: row.loc_name,
          created_datetime: row.created_datetime,
          updated_datetime: row.updated_datetime,
        };
      });
      return locations;
    } catch (err) {
      throw err;
    }
  }

  public async CreateLocation(locName: string, orgId: string) {
    try {
      let query =
        'INSERT INTO locations ' +
        '(org_id, loc_name, created_datetime, updated_datetime) ' +
        'VALUES ($1, $2, $3, $4) ' +
        'RETURNING id;';
      let now = nowISO();
      const { rows } = await db.query(query, [locName, orgId, now, now]);
      const location: ILocation = {
        id: rows[0].id,
        loc_name: locName,
        org_id: orgId,
        created_datetime: now,
        updated_datetime: now,
      };
      return location;
    } catch (err) {
      throw err;
    }
  }

  public async UpdateLocation(location: ILocation) {
    try {
      let selectQuery =
        'SELECT id, org_id, loc_name ' + 'FROM locations ' + 'WHERE id = $1;';
      let selectRows = await db.query(selectQuery, [location.id]);

      if (selectRows.rows.length === 0) {
        throw new Error('location not found');
      }

      const oldLocation = selectRows.rows[0];
      const now = nowISO();
      const newLocation: ILocation = {
        id: location.id,
        org_id: location.org_id,
        loc_name: location.loc_name || oldLocation.loc_name,
        updated_datetime: now,
      };

      let updateQuery =
        'UPDATE locations ' +
        'SET loc_name = $3, updated_datetime = $4' +
        'WHERE id = $1 and org_id = $2;';
      await db.query(updateQuery, [
        newLocation.id,
        newLocation.loc_name,
        newLocation.updated_datetime,
      ]);
      return newLocation;
    } catch (err) {
      throw err;
    }
  }

  public async DeleteLocation(location: ILocation) {
    try {
      let query = 'DELETE FROM locations WHERE id = $1 AND org_id = $2;';
      await db.query(query, [location.id, location.org_id]);
    } catch (err) {
      throw err;
    }
  }
}
