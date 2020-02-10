import uuid from 'uuid';

import User from '../../src/models/user';
import { IUserSafe } from '../../src/interfaces/IUser';
import { IOrganization } from '../../src/interfaces/IOrganization';
import { IPet } from '../../src/interfaces/IPet';
import { ILocation } from '../../src/interfaces/ILocation';
import { IAppointment } from '../../src/interfaces/IAppointment';
import AppointmentService from '../../src/services/appointment';
import Organization from '../../src/models/organization';
import Pet from '../../src/models/pet';
import Location from '../../src/models/location';

/**
 * Setup:
 *  1. create user
 *  2. create org
 *  3. create location
 *  4. create pet
 */
let mockIds = {
  userEmail: 'test@test.com',
  orgId: uuid(),
  locId: uuid(),
  apptGroomingId: uuid(),
  apptBoardingId: uuid(),
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

const apptBoarding: IAppointment = {
  id: mockIds.apptBoardingId,
  user_email: mockIds.userEmail,
  loc_id: mockIds.locId,
  org_id: mockIds.orgId,
  pet_id: mockIds.petId,
  is_boarding: true,
  is_grooming: false,
};

const apptGrooming: IAppointment = {
  id: mockIds.apptGroomingId,
  user_email: mockIds.userEmail,
  loc_id: mockIds.locId,
  org_id: mockIds.orgId,
  pet_id: mockIds.petId,
  is_boarding: false,
  is_grooming: true,
};

beforeAll(async () => {
  try {
    await User.create(user);
    await Organization.create(organization);
    await Pet.create(pet);
    await Location.create(location);
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
  try {
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

describe('Test the appointment service', () => {
  const apptService = new AppointmentService();

  test('should create a new boarding appointment', async () => {
    const newAppt = await apptService.CreateAppointment(apptBoarding);
    expect(newAppt).toEqual(
      expect.objectContaining({
        id: mockIds.apptBoardingId,
        user_email: mockIds.userEmail,
      })
    );
    expect(newAppt).toHaveProperty('created_datetime');
    expect(newAppt).toHaveProperty('updated_datetime');
  });

  test('should create a new grooming appointment', async () => {
    const newAppt = await apptService.CreateAppointment(apptGrooming);
    expect(newAppt).toEqual(
      expect.objectContaining({
        id: mockIds.apptGroomingId,
        user_email: mockIds.userEmail,
      })
    );
    expect(newAppt).toHaveProperty('created_datetime');
    expect(newAppt).toHaveProperty('updated_datetime');
  });

  test('should get the new appointment', async () => {
    const newAppt = await apptService.GetAppointment(mockIds.apptGroomingId);
    expect(newAppt).toEqual(
      expect.objectContaining({
        id: mockIds.apptGroomingId,
        user_email: mockIds.userEmail,
      })
    );
    expect(newAppt).toHaveProperty('created_datetime');
    expect(newAppt).toHaveProperty('updated_datetime');
  });

  test('should get all appointments for location', async () => {
    const newAppts = await apptService.GetAppointmentsByLocation(mockIds.locId);
    expect(newAppts).toHaveLength(2);
  });

  test('should get all appointments for org', async () => {
    const newAppts = await apptService.GetAppointmentsByOrg(mockIds.orgId);
    expect(newAppts).toHaveLength(2);
  });

  test('should update grooming to the boarding appointment', async () => {
    const apptBoardingGrooming: IAppointment = JSON.parse(
      JSON.stringify(apptBoarding)
    );
    apptBoardingGrooming.is_grooming = true;
    const newAppt = await apptService.UpdateAppointment(apptBoardingGrooming);
    expect(newAppt).toEqual(
      expect.objectContaining({
        id: mockIds.apptBoardingId,
        user_email: mockIds.userEmail,
        is_grooming: true,
        is_boarding: true,
      })
    );
    expect(newAppt).toHaveProperty('created_datetime');
    expect(newAppt).toHaveProperty('updated_datetime');
    expect(newAppt.updated_datetime).not.toBe(apptBoarding.updated_datetime);
  });

  test('should delete boarding appoitnment', async () => {
    async function deleteAppt() {
      await apptService.DeleteAppointment(apptBoarding.id);
    }
    await expect(deleteAppt()).resolves.toBeUndefined();
  });

  test('should delete grooming appoitnment', async () => {
    async function deleteAppt() {
      await apptService.DeleteAppointment(apptGrooming.id);
    }
    await expect(deleteAppt()).resolves.toBeUndefined();
  });

  test('should reject delete due to appointment not found', async () => {
    async function deleteAppt() {
      await apptService.DeleteAppointment(apptBoarding.id);
    }
    await expect(deleteAppt()).rejects.toThrowError();
  });
});
