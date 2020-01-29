import { nowISO } from '../utils';
import db from '../db';
import { IOrganization } from '../interfaces/IOrganization';

export class OrganizationService {
  constructor() {}

  public async GetOrganization(orgId: string) {
    try {
      let query =
        'SELECT id, org_name, subdomain_name, created_datetime, updated_datetime ' +
        'FROM organizations ' +
        'WHERE id = $1;';
      const { rows } = await db.query(query, [orgId]);
      const organization = <IOrganization>rows[0];
      return organization;
    } catch (err) {
      throw err;
    }
  }

  public async CreateOrganization(organization: IOrganization) {
    try {
      const newAppointment = JSON.parse(JSON.stringify(organization));
      const now = nowISO();
      newAppointment.created_datetime = now;
      newAppointment.updated_datetime = now;

      const { org_name, created_datetime, updated_datetime } = newAppointment;
      const queryParams = [org_name, created_datetime, updated_datetime];

      let query =
        'INSERT INTO organizations ' +
        '(org_name, created_datetime, updated_datetime) ' +
        'VALUES ($1, $2, $3) ' +
        'RETURNING id;';
      const { rows } = await db.query(query, queryParams);
      newAppointment.id = rows[0].id;
      return newAppointment;
    } catch (err) {
      throw err;
    }
  }

  public async UpdateOrganization(organization: IOrganization) {
    try {
      const selectQuery =
        'SELECT id, org_name, subdomain_name ' +
        'FROM organizations ' +
        'WHERE id = $1;';

      let selectResult = await db.query(selectQuery, [organization.id]);

      if (selectResult.rows.length === 0) {
        throw new Error('org not found');
      }

      const oldOrganization = <IOrganization>selectResult.rows[0];
      const newOrganization = Object.assign(oldOrganization, organization);
      newOrganization.updated_datetime = nowISO();

      const {
        id,
        org_name,
        subdomain_name,
        updated_datetime,
      } = newOrganization;
      const queryParams = [id, org_name, subdomain_name, updated_datetime];

      let updateQuery =
        'UPDATE organizations ' +
        'SET org_name = $2, subdomain_name = $3, updated_datetime = $4' +
        'WHERE id = $1;';
      await db.query(updateQuery, queryParams);
      return newOrganization;
    } catch (err) {
      throw err;
    }
  }

  public async DeleteOrganization(id: string) {
    try {
      let query = 'DELETE FROM organizations WHERE id = $1;';
      await db.query(query, [id]);
    } catch (err) {
      throw err;
    }
  }
}
