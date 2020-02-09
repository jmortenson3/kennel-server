import config from '../../config';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(config.db.uri, {
  define: {
    timestamps: false,
  },
  pool: {
    max: 1,
    min: 0,
    idle: 100,
    acquire: 60000,
  },
  retry: {
    max: 3,
  },
});
