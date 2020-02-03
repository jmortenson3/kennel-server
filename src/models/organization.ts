import {
  Sequelize,
  DataTypes,
  Model,
  ModelAttributes,
  InitOptions,
  HasManyGetAssociationsMixin,
  UUIDV4,
} from 'sequelize';
import config from '../../config';
import Location from './location';
import Membership from './membership';
import { sequelize } from '../db';
import Appointment from './appointment';

class Organization extends Model {
  public org_name: string;
  public id?: string;
  public subdomain_name?: string | null;
  public updated_datetime?: string | null;
  public created_datetime?: string | null;

  public getLocations: HasManyGetAssociationsMixin<Location>;
  public getAppointments: HasManyGetAssociationsMixin<Appointment>;
  public getMemberships: HasManyGetAssociationsMixin<Membership>;
}

const attributes: ModelAttributes = {
  org_name: {
    type: DataTypes.TEXT,
  },
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4,
  },
  subdomain_name: {
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
  modelName: 'organization',
};

Organization.init(attributes, options);

Organization.hasMany(Location, {
  foreignKey: 'org_id',
  sourceKey: 'id',
});

Organization.hasMany(Appointment, {
  foreignKey: 'org_id',
  sourceKey: 'id',
});

Organization.hasMany(Membership, {
  foreignKey: 'org_id',
  sourceKey: 'id',
});

export default Organization;
