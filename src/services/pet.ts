import { IPet } from '../interfaces/IPet';
import db from '../db';
import { nowISO } from '../utils';

export class PetService {
  constructor() {}

  public async GetPetById(id: string) {
    try {
      let query =
        'SELECT id, pet_name, user_email, birth_date, created_datetime, updated_datetime, pet_type, breed ' +
        'FROM pets ' +
        'WHERE id = $1;';
      const { rows } = await db.query(query, [id]);
      const pet = <IPet>rows[0];
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
      let query =
        'SELECT id, pet_name, user_email, birth_date, created_datetime, updated_datetime, pet_type, breed ' +
        'FROM pets ' +
        'WHERE user_email = $1;';
      const { rows } = await db.query(query, [cleansedUserEmail]);
      const pets = rows.map(row => {
        const pet = <IPet>row;
        return pet;
      });

      return pets;
    } catch (err) {
      throw err;
    }
  }

  public async GetPets() {
    try {
      let query =
        'SELECT id, pet_name, user_email, birth_date, created_datetime, updated_datetime, pet_type, breed ' +
        'FROM pets;';
      const { rows } = await db.query(query);
      const pets = rows.map(row => {
        const pet = <IPet>row;
        return pet;
      });
      return pets;
    } catch (err) {
      throw err;
    }
  }

  public async CreatePet(pet: IPet) {
    try {
      const newPet = JSON.parse(JSON.stringify(pet));
      const now = nowISO();
      newPet.created_datetime = now;
      newPet.updated_datetime = now;
      const {
        user_email,
        pet_name,
        birth_date,
        created_datetime,
        updated_datetime,
        pet_type,
        breed,
      } = newPet;
      const queryParams = [
        user_email,
        pet_name,
        birth_date,
        created_datetime,
        updated_datetime,
        pet_type,
        breed,
      ];
      let query =
        'INSERT INTO pets ' +
        '(user_email, pet_name, birth_date, created_datetime, updated_datetime, pet_type, breed) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7) ' +
        'RETURNING id;';
      const { rows } = await db.query(query, queryParams);
      newPet.id = rows[0].id;
      return newPet;
    } catch (err) {
      throw err;
    }
  }

  public async UpdatePet(pet: IPet) {
    try {
      let selectQuery =
        'SELECT id, pet_name, user_email, birth_date, created_datetime, updated_datetime, pet_type, breed ' +
        'FROM pets ' +
        'WHERE id = $1;';
      let selectResponse = await db.query(selectQuery, [pet.id]);

      if (selectResponse.rows.length === 0) {
        throw new Error('pet not found');
      }

      const oldPet = <IPet>selectResponse.rows[0];
      const newPet = Object.assign(oldPet, pet);
      newPet.updated_datetime = nowISO();
      const {
        id,
        user_email,
        pet_name,
        birth_date,
        pet_type,
        breed,
        updated_datetime,
      } = newPet;
      const queryParams = [
        id,
        user_email,
        pet_name,
        birth_date,
        pet_type,
        breed,
        updated_datetime,
      ];

      let updateQuery =
        'UPDATE pets ' +
        'SET user_email = $2, pet_name = $3, birth_date = $4, pet_type = $5, breed = $6, updated_datetime = $7' +
        'WHERE id = $1;';
      await db.query(updateQuery, queryParams);
      return newPet;
    } catch (err) {
      throw err;
    }
  }

  public async DeletePet(id: string) {
    try {
      let query = 'DELETE FROM pets WHERE id = $1;';
      await db.query(query, [id]);
    } catch (err) {
      throw err;
    }
  }
}
