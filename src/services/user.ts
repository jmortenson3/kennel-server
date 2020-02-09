import { IUserSafe, IUser } from '../interfaces/IUser';
import { IMembership } from '../interfaces/IMembership';
import { nowISO, clone, hashPassword } from '../utils';
import User from '../models/user';
import Membership from '../models/membership';

export class UserService {
  constructor() {}

  public async CreateUser(user: IUser) {
    try {
      if (!user.email) {
        throw new Error('email not provided for signup');
      }

      const emailLower = user.email.toLowerCase();

      const potentialUser = await User.findOne({
        where: { email: emailLower },
      });

      if (potentialUser) {
        throw new Error('user already exists');
      }

      const hashedPassword = await hashPassword(user.password);
      const now = nowISO();
      const userModel: IUserSafe = {
        email: emailLower,
        created_datetime: now,
        updated_datetime: now,
      };

      const newUser = await User.create({
        ...userModel,
        hashed_password: hashedPassword,
      });
      return userModel;
    } catch (err) {
      throw err;
    }
  }

  public async GetUserDetails(userEmail: string) {
    try {
      const userRecord = await User.findOne({
        attributes: ['email', 'created_datetime', 'updated_datetime'],
        where: {
          email: userEmail,
        },
      });

      if (!userRecord) {
        throw new Error('user not found');
      }

      const user = <IUserSafe>userRecord.toJSON();
      return user;
    } catch (err) {
      throw err;
    }
  }

  public async GetMembershipsByUser(userEmail: string) {
    try {
      const user = await User.findOne({ where: { email: userEmail } });

      if (!user) {
        throw new Error('user not found');
      }

      const memberships = await user.getMemberships();
      return memberships;
    } catch (err) {
      throw err;
    }
  }

  public async UpdateMembership(membership: IMembership) {
    try {
      const oldMembership = await Membership.findOne({
        where: {
          org_id: membership.org_id,
          user_email: membership.user_email,
        },
      });

      if (!oldMembership) {
        throw new Error('membership not found');
      }

      const {
        can_accept_appointments,
        can_deny_appointments,
        can_edit_kennel_layout,
      } = Object.assign(<IMembership>oldMembership, membership);

      const newMembership = await oldMembership.update({
        can_accept_appointments,
        can_deny_appointments,
        can_edit_kennel_layout,
        updated_datetime: nowISO(),
      });
      return newMembership;
    } catch (err) {
      throw err;
    }
  }

  public async CreateMembership(membership: IMembership): Promise<IMembership> {
    try {
      const membershipModel: Membership = clone(membership);
      const now = nowISO();
      membershipModel.created_datetime = now;
      membershipModel.updated_datetime = now;
      const newMembership = await Membership.create(membershipModel);
      return newMembership;
    } catch (err) {
      throw err;
    }
  }

  public async DeleteMembership(orgId: string, userEmail: string) {
    try {
      const membership = await Membership.findOne({
        where: {
          org_id: orgId,
          user_email: userEmail,
        },
      });

      if (!membership) {
        throw new Error('membership not found');
      }
      await membership.destroy();
    } catch (err) {
      throw err;
    }
  }

  public async DeleteUser(userEmail: string) {
    try {
      const user = await User.findOne({
        where: {
          email: userEmail,
        },
      });

      if (!user) {
        throw new Error('user email not found');
      }

      await user.destroy();
    } catch (err) {
      throw err;
    }
  }
}
