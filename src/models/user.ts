import {
  DataTypes,
  Model,
  ModelAttributes,
  InitOptions,
  HasManyGetAssociationsMixin,
} from 'sequelize';
import Pet from './pet';
import { sequelize } from '../db';
import Membership from './membership';
import Appointment from './appointment';

class User extends Model {
  public email: string;
  public hashed_password?: string;
  public created_datetime?: string | null;
  public updated_datetime?: string | null;

  public getPets: HasManyGetAssociationsMixin<Pet>;
  public getMemberships: HasManyGetAssociationsMixin<Membership>;
  public getAppointments: HasManyGetAssociationsMixin<Appointment>;
}

const attributes: ModelAttributes = {
  email: {
    type: DataTypes.TEXT,
    primaryKey: true,
    allowNull: false,
  },
  hashed_password: {
    type: DataTypes.TEXT,
  },
  created_datetime: {
    type: DataTypes.TEXT,
  },
  updated_datetime: {
    type: DataTypes.TEXT,
  },
};

const options: InitOptions = {
  sequelize,
  modelName: 'user',
};

User.init(attributes, options);

User.hasMany(Pet, {
  foreignKey: 'user_email',
  sourceKey: 'email',
});

User.hasMany(Membership, {
  foreignKey: 'user_email',
  sourceKey: 'email',
});

User.hasMany(Appointment, {
  foreignKey: 'user_email',
  sourceKey: 'email',
});

export default User;
