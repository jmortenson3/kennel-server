import express, { Request, Response, NextFunction } from 'express';

import { PetService } from '../services/pet';
import { IPet } from '../interfaces/IPet';
import Pet from '../models/pet';
import { UUID } from '../models/uuid';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_email, pet_name, birth_date, pet_type, breed } = req.body;

    if (!pet_name || !user_email) {
      throw new Error('user_email or pet_name is not defined');
    }

    const pet: Pet = Pet.build({
      pet_name,
      user_email: user_email.trim(),
      birth_date,
      pet_type,
      breed,
    });
    const petService = new PetService();
    const newPet = await petService.CreatePet(pet);
    res.status(200).json({ data: newPet });
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error('pet id is not defined');
    }

    const petId = id.trim();
    const uuid = new UUID(petId);

    if (!uuid.isValid()) {
      throw new Error('invalid pet id');
    }

    const petService = new PetService();
    const pet = await petService.GetPetById(petId);
    res.status(200).json({ data: pet });
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const petService = new PetService();
    let pets: IPet[];
    if (req.query.user_email) {
      pets = await petService.GetPetsByUser(req.query.user_email);
    } else {
      pets = await petService.GetPets();
    }

    res.status(200).json({ data: pets });
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error('pet id is not defined');
    }

    const petId = id.trim();
    const uuid = new UUID(petId);

    if (!uuid.isValid()) {
      throw new Error('invalid pet id');
    }

    let { user_email, pet_name, birth_date, pet_type, breed } = req.body;
    const emailLower = user_email ? user_email.toLowerCase() : undefined;
    const pet: IPet = {
      id: petId,
      user_email: emailLower,
      pet_name,
      birth_date,
      pet_type,
      breed,
    };
    const petService = new PetService();
    const newPet = await petService.UpdatePet(pet);
    res.status(200).json({ data: newPet });
  } catch (err) {
    next({ message: err.message, statusCode: 400 });
  }
});

router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      if (!id) {
        throw new Error('pet id is not defined');
      }

      const petId = id.trim();
      const uuid = new UUID(petId);

      if (!uuid.isValid()) {
        throw new Error('invalid pet id');
      }

      const petService = new PetService();
      await petService.DeletePet(petId);
      res.status(200).json({});
    } catch (err) {
      next({ message: err.message, statusCode: 400 });
    }
  }
);

module.exports = router;
