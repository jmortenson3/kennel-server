import uuid from 'uuid';
import { IUserSafe } from '../interfaces/IUser';
import { IPet } from '../interfaces/IPet';
import User from '../models/user';
import { PetService } from '../services/pet';
/**
 * Setup
 *  1. create user
 */

let mockIds = {
  userEmail: 'test@test.com',
  orgId: uuid(),
  locId: uuid(),
  apptId: uuid(),
  pet1Id: uuid(),
  pet2Id: uuid(),
};

const user: IUserSafe = {
  email: mockIds.userEmail,
  hashed_password:
    '$2b$10$FTq5Sn8ySnPX/gxWQF0Gjuxz2AEizMyLLLPwR5ddUD5AzE1q6eDti',
};

const lucy: IPet = {
  id: mockIds.pet1Id,
  pet_name: 'Lucy',
  user_email: user.email,
  breed: 'house',
  pet_type: 'cat',
};

const carl: IPet = {
  id: mockIds.pet2Id,
  pet_name: 'Carl',
  user_email: user.email,
  breed: 'beagle',
  pet_type: 'dog',
};

beforeAll(async () => {
  try {
    await User.create(user);
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
  try {
    await User.destroy({ where: { email: mockIds.userEmail } });
  } catch (err) {
    console.log(err);
  }
});

describe('Test the pet service', () => {
  const petService = new PetService();
  test('reject from null args', async () => {
    async function createPet() {
      await petService.CreatePet(null);
    }
    await expect(createPet()).rejects.toThrowError();
  });

  test('create dog Carl', async () => {
    const newPet = await petService.CreatePet(carl);
    expect(newPet).toHaveProperty('pet_name', carl.pet_name);
    expect(newPet).toHaveProperty('user_email', carl.user_email);
    expect(newPet).toHaveProperty('id', carl.id);
    expect(newPet).toHaveProperty('pet_type', carl.pet_type);
    expect(newPet).toHaveProperty('created_datetime');
    expect(newPet).toHaveProperty('updated_datetime');
  });

  test('create cat Lucy', async () => {
    const newPet = await petService.CreatePet(lucy);
    expect(newPet).toHaveProperty('pet_name', lucy.pet_name);
    expect(newPet).toHaveProperty('user_email', lucy.user_email);
    expect(newPet).toHaveProperty('id', lucy.id);
    expect(newPet).toHaveProperty('pet_type', lucy.pet_type);
    expect(newPet).toHaveProperty('created_datetime');
    expect(newPet).toHaveProperty('updated_datetime');
  });

  test('rename lucy to lucky', async () => {
    const lucky: IPet = JSON.parse(JSON.stringify(lucy));
    lucky.pet_name = 'Lucky';
    const updatedPet = await petService.UpdatePet(lucky);
    expect(updatedPet).toHaveProperty('pet_name', lucky.pet_name);
    expect(updatedPet).toHaveProperty('user_email', lucy.user_email);
  });

  test('should get only carl', async () => {
    const pet = await petService.GetPetById(carl.id);
    expect(pet).toHaveProperty('pet_name', 'Carl');
  });

  test("should get test@test.com's two pets", async () => {
    const pets = await petService.GetPetsByUser(user.email);
    expect(pets).toHaveLength(2);
  });

  test('should delete carl', async () => {
    async function deletePet() {
      await petService.DeletePet(carl.id);
    }
    await expect(deletePet()).resolves.toBeUndefined();
  });

  test('should delete lucy (now lucky)', async () => {
    async function deletePet() {
      await petService.DeletePet(lucy.id);
    }
    await expect(deletePet()).resolves.toBeUndefined();
  });

  test('should reject with error because carl is already deleted', async () => {
    async function deletePet() {
      await petService.DeletePet(carl.id);
    }
    await expect(deletePet()).rejects.toThrowError();
  });
});
