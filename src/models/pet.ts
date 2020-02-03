import {
  Sequelize,
  DataTypes,
  Model,
  ModelAttributes,
  InitOptions,
  UUIDV4,
} from 'sequelize';
import { sequelize } from '../db';

class Pet extends Model {
  public pet_name: string;
  public id?: string;
  public user_email: string;
  public birth_date?: string | null;
  public created_datetime?: string | null;
  public updated_datetime?: string | null;
  public pet_type?: string | null;
  public breed?: string | null;
}

const attributes: ModelAttributes = {
  pet_name: {
    type: DataTypes.TEXT,
  },
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4,
  },
  user_email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  birth_date: {
    type: DataTypes.TEXT,
  },
  created_datetime: {
    type: DataTypes.TEXT,
  },
  updated_datetime: {
    type: DataTypes.TEXT,
  },
  pet_type: {
    type: DataTypes.TEXT,
  },
  breed: {
    type: DataTypes.TEXT,
  },
};

const options: InitOptions = {
  sequelize,
  modelName: 'pet',
};

Pet.init(attributes, options);

export default Pet;
