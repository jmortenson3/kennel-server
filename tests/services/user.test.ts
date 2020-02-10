import UserService from '../../src/services/user';
import { IUser, IUserSafe } from '../../src/interfaces/IUser';
import { IOrganization } from '../../src/interfaces/IOrganization';
import { IAppointment } from '../../src/interfaces/IAppointment';
import { ILocation } from '../../src/interfaces/ILocation';
import { IPet } from '../../src/interfaces/IPet';
import User from '../../src/models/user';
import Organization from '../../src/models/organization';
import Location from '../../src/models/location';
import Appointment from '../../src/models/appointment';
import Pet from '../../src/models/pet';
import uuid from 'uuid';
import { IMembership } from '../../src/interfaces/IMembership';

/**
 * Setup:
 *  1. create organization
 *  2. create location
 *  3. create pet
 *  4. create appointment
 */
let mockIds = {
  userEmail: 'test@test.com',
  orgId: uuid(),
  locId: uuid(),
  apptId: uuid(),
  petId: uuid(),
};

const user: IUserSafe = {
  email: mockIds.userEmail,
  hashed_password:
    '$2b$10$FTq5Sn8ySnPX/gxWQF0Gjuxz2AEizMyLLLPwR5ddUD5AzE1q6eDti',
};

const organization: IOrganization = {
  id: mockIds.orgId,
  org_name: 'test_org',
  subdomain_name: 'test_org',
};

const pet: IPet = {
  id: mockIds.petId,
  pet_name: 'Lucy',
  user_email: user.email,
  breed: 'cat',
  pet_type: 'cat',
};

const location: ILocation = {
  id: mockIds.locId,
  org_id: mockIds.orgId,
  loc_name: 'test_loc',
};

const appointment: IAppointment = {
  id: mockIds.apptId,
  user_email: mockIds.userEmail,
  loc_id: mockIds.locId,
  org_id: mockIds.orgId,
  pet_id: mockIds.petId,
  is_boarding: true,
  is_grooming: true,
};

const membership: IMembership = {
  org_id: mockIds.orgId,
  user_email: mockIds.userEmail,
  can_accept_appointments: true,
  can_deny_appointments: true,
  can_edit_kennel_layout: true,
};

beforeAll(async () => {
  try {
    await User.create(user);
    await Organization.create(organization);
    await Pet.create(pet);
    await Location.create(location);
    await Appointment.create(appointment);
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
  try {
    await Appointment.destroy({ where: { id: mockIds.apptId } });
    await Location.destroy({ where: { id: mockIds.locId } });
    await Organization.destroy({ where: { id: mockIds.orgId } });
    await Pet.destroy({ where: { id: mockIds.petId } });
    await User.destroy({ where: { email: mockIds.userEmail } });
  } catch (err) {
    console.log('MOCK IDs:');
    console.log(mockIds);
    console.log(err);
  }
});

describe('Test the user service', () => {
  const userService = new UserService();

  test('should create a user with email hello@example.com', async () => {
    const user: IUser = {
      email: 'hello@example.com',
      password: 'test123',
      repassword: 'test123',
    };
    const newUser = await userService.CreateUser(user);
    expect(newUser).toHaveProperty('email');
    expect(newUser.email).toBe('hello@example.com');
    expect(newUser).not.toHaveProperty('hashed_password');
    expect(newUser).toHaveProperty('created_datetime');
    expect(newUser).toHaveProperty('updated_datetime');
  });

  test('should get the user hello@example.com', async () => {
    const user = await userService.GetUserDetails('hello@example.com');
    expect(user).toBeDefined();
    expect(user.email).toBe('hello@example.com');
  });

  test('should not find a user', async () => {
    async function getUser() {
      await userService.GetUserDetails('');
    }
    await expect(getUser()).rejects.toThrowError();
  });

  test('should delete the hello@example.com user', async () => {
    async function deleteUser() {
      await userService.DeleteUser('hello@example.com');
    }
    await expect(deleteUser()).resolves.toBe(undefined);
  });

  test('should throw error if email is empty string', async () => {
    async function deleteUser() {
      await userService.DeleteUser('');
    }
    await expect(deleteUser()).rejects.toThrowError();
  });

  test('should create a membership for user test@test.com', async () => {
    const newMembership = await userService.CreateMembership(membership);
    expect(newMembership).toHaveProperty('org_id', membership.org_id);
    expect(newMembership).toHaveProperty('user_email', membership.user_email);
    expect(newMembership).toHaveProperty(
      'can_accept_appointments',
      membership.can_accept_appointments
    );
    expect(newMembership).toHaveProperty('updated_datetime');
    expect(newMembership).toHaveProperty('created_datetime');
  });

  test('should get memberships for user test@test.com', async () => {
    const memberships = await userService.GetMembershipsByUser(
      mockIds.userEmail
    );
    expect(memberships).toHaveLength(1);
  });

  test('should update the membership', async () => {
    async function updateMembership() {
      const membershipChanges = JSON.parse(JSON.stringify(membership));
      membershipChanges.can_accept_appointments = false;
      const updatedMembership = await userService.UpdateMembership(
        membershipChanges
      );
      return (<IMembership>updatedMembership.toJSON()).can_accept_appointments;
    }
    await expect(updateMembership()).resolves.toBeFalsy();
  });

  test('should delete the membership', async () => {
    async function deleteMembership() {
      await userService.DeleteMembership(mockIds.orgId, mockIds.userEmail);
    }
    await expect(deleteMembership()).resolves.toBeUndefined();
  });

  test('should reject because no memberships found', async () => {
    async function deleteMembership() {
      await userService.DeleteMembership(mockIds.orgId, mockIds.userEmail);
    }
    await expect(deleteMembership()).rejects.toThrowError();
  });
});
