import {
  DataTypes,
  Model,
  ModelAttributes,
  InitOptions,
  HasManyGetAssociationsMixin,
  UUIDV4,
} from 'sequelize';
import Appointment from './appointment';
import { sequelize } from '../db';

class Location extends Model {
  public org_id: string;
  public id: string;
  public loc_name: string | null;
  public created_datetime: string | null;
  public updated_datetime: string | null;

  public getAppointments: HasManyGetAssociationsMixin<Appointment>;
}

const attributes: ModelAttributes = {
  org_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4,
  },
  loc_name: {
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
  modelName: 'location',
};

Location.init(attributes, options);

Location.hasMany(Appointment, {
  foreignKey: 'loc_id',
  sourceKey: 'id',
});

export default Location;
