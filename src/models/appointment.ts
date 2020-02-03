import {
  DataTypes,
  Model,
  ModelAttributes,
  InitOptions,
  UUIDV4,
} from 'sequelize';
import { sequelize } from '../db';

class Appointment extends Model {
  public loc_id: string;
  public id?: string;
  public org_id?: string;
  public is_boarding?: boolean;
  public is_grooming?: boolean;
  public dropoff_datetime?: string | null;
  public pickup_datetime?: string | null;
  public user_email?: string;
  public pet_id?: string;
  public notes?: string | null;
  public status?: string | null;
  public created_datetime?: string | null;
  public updated_datetime?: string | null;
}

const attributes: ModelAttributes = {
  loc_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4,
  },
  org_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  is_boarding: {
    type: DataTypes.BOOLEAN,
  },
  is_grooming: {
    type: DataTypes.BOOLEAN,
  },
  dropoff_datetime: {
    type: DataTypes.TEXT,
  },
  pickup_datetime: {
    type: DataTypes.TEXT,
  },
  user_email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pet_id: {
    type: DataTypes.UUID,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  status: {
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
  modelName: 'appointment',
};

Appointment.init(attributes, options);

export default Appointment;
