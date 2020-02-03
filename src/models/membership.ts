import { DataTypes, Model, ModelAttributes, InitOptions } from 'sequelize';
import { sequelize } from '../db';

class Membership extends Model {
  public org_id: string;
  public user_email: string;
  public can_accept_appointments?: boolean;
  public can_deny_appointments?: boolean;
  public can_edit_kennel_layout?: boolean;
  public created_datetime?: string | null;
  public updated_datetime?: string | null;
}

const attributes: ModelAttributes = {
  org_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  user_email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  can_accept_appointments: {
    type: DataTypes.BOOLEAN,
  },
  can_deny_appointments: {
    type: DataTypes.BOOLEAN,
  },
  can_edit_kennel_layout: {
    type: DataTypes.BOOLEAN,
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
  modelName: 'membership',
};

Membership.init(attributes, options);

export default Membership;
