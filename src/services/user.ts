import { IUserSafe } from '../interfaces/IUser';
import db from '../db';
import { IMembership } from '../interfaces/IMembership';
import { nowISO } from '../utils';

export class UserService {
  constructor() {}

  public async GetUserDetails(userEmail: string) {
    try {
      let query =
        'SELECT email, created_datetime, updated_datetime ' +
        'FROM users ' +
        'WHERE email = $1;';
      const { rows } = await db.query(query, [userEmail]);
      const { email, created_datetime, updated_datetime } = rows[0];
      const user: IUserSafe = { email, created_datetime, updated_datetime };
      return user;
    } catch (err) {
      throw err;
    }
  }

  public async GetMemberships(userEmail: string) {
    try {
      let query =
        'SELECT org_id, user_email, can_accept_appointments, can_deny_appointments, can_edit_kennel_layout ' +
        'FROM organization_memberships ' +
        'WHERE user_email = $1;';
      const { rows } = await db.query(query, [userEmail]);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  public async GetMembershipsByOrg(userEmail: string, orgId: string) {
    try {
      let query =
        'SELECT org_id, user_email, can_accept_appointments, can_deny_appointments, can_edit_kennel_layout ' +
        'FROM organization_memberships ' +
        'WHERE user_email = $1 and org_id = $2;';
      const { rows } = await db.query(query, [userEmail, orgId]);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  public async UpdateMembership(membership: IMembership) {
    try {
      let selectQuery =
        'SELECT org_id, user_email, can_accept_appointments, can_deny_appointments, can_edit_kennel_layout ' +
        'FROM organization_memberships ' +
        'WHERE org_id = $1 AND user_email = $2;';
      let selectResponse = await db.query(selectQuery, [
        membership.org_id,
        membership.userEmail,
      ]);

      if (selectResponse.rows.length === 0) {
        throw new Error('membership not found');
      }

      let oldMembership = <IMembership>selectResponse.rows[0];
      const newMembership: IMembership = Object.assign(
        oldMembership,
        membership
      );
      newMembership.updated_datetime = nowISO();

      const {
        org_id,
        userEmail,
        can_accept_appointments,
        can_deny_appointments,
        can_edit_kennel_layout,
        updated_datetime,
      } = newMembership;
      const queryParams = [
        org_id,
        userEmail,
        can_accept_appointments,
        can_deny_appointments,
        can_edit_kennel_layout,
        updated_datetime,
      ];

      let updateQuery =
        'UPDATE organization_memberships ' +
        'SET can_accept_appointments = $3, can_deny_appointments = $4, can_edit_kennel_layout = $5, updated_datetime = $6' +
        'WHERE org_id = $1 AND user_email = $2;';
      await db.query(updateQuery, queryParams);
      return newMembership;
    } catch (err) {
      throw err;
    }
  }

  public async CreateMembership(membership: IMembership): Promise<void> {
    try {
      let query =
        'INSERT INTO organization_memberships ' +
        '(org_id, user_email, created_datetime, updated_datetime) ' +
        'VALUES ($1, $2, $3, $4) ' +
        'RETURNING org_id, user_email, created_datetime, updated_datetime;';
      await db.query(query, [
        membership.org_id,
        membership.userEmail,
        membership.created_datetime,
        membership.updated_datetime,
      ]);
    } catch (err) {
      throw err;
    }
  }

  public async DeleteMembership(membership: IMembership): Promise<void> {
    try {
      let query =
        'DELETE FROM organization_memberships WHERE org_id = $1 AND user_email = $2;';
      await db.query(query, [membership.org_id, membership.userEmail]);
    } catch (err) {
      throw err;
    }
  }
}
