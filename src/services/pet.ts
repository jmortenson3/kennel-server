import { IPet } from '../interfaces/IPet';
import { nowISO } from '../utils';
import User from '../models/user';
import Pet from '../models/pet';

export class PetService {
  constructor() {}

  public async GetPetById(id: string) {
    try {
      const pet = await Pet.findOne({ where: { id } });
      return pet;
    } catch (err) {
      throw err;
    }
  }

  public async GetPetsByUser(userEmail: string) {
    try {
      if (!userEmail) {
        throw new Error('userEmail is undefined');
      }

      const cleansedUserEmail = userEmail.toLowerCase();
      const user = await User.findOne({ where: { email: cleansedUserEmail } });

      if (!user) {
        throw new Error('user not found');
      }

      const pets = await user.getPets();
      return pets;
    } catch (err) {
      throw err;
    }
  }

  public async GetPets() {
    try {
      const pets = await Pet.findAll();
      return pets;
    } catch (err) {
      throw err;
    }
  }

  public async CreatePet(pet: IPet) {
    try {
      const emailLower = pet.user_email.toLowerCase();
      const user = await User.findOne({ where: { email: emailLower } });

      if (!user) {
        throw new Error('pet owner does not exist');
      }

      const petModel = JSON.parse(JSON.stringify(pet));
      const now = nowISO();
      petModel.created_datetime = now;
      petModel.updated_datetime = now;
      const newPet = await Pet.create(petModel);
      return newPet;
    } catch (err) {
      throw err;
    }
  }

  public async UpdatePet(pet: IPet) {
    try {
      const oldPet = await Pet.findOne({ where: { id: pet.id } });

      if (!oldPet) {
        throw new Error('pet not found');
      }

      const {
        user_email,
        pet_name,
        birth_date,
        pet_type,
        breed,
      } = Object.assign(<IPet>oldPet, pet);

      const newPet = await oldPet.update({
        user_email,
        pet_name,
        pet_type,
        breed,
        birth_date,
        updated_datetime: nowISO(),
      });

      return newPet;
    } catch (err) {
      throw err;
    }
  }

  public async DeletePet(id: string) {
    try {
      const pet = await Pet.findOne({ where: { id } });
      if (!pet) {
        throw new Error('pet not found');
      }

      await pet.destroy();
    } catch (err) {
      throw err;
    }
  }
}
