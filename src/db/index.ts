import { Pool } from 'pg';
import config from '../../config';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(config.db.uri, {
  define: {
    timestamps: false,
  },
});

(async function(): Promise<void> {
  try {
    console.log('attempting to connect with sequelize...');
    await sequelize.authenticate();
    console.log('success!');
  } catch (err) {
    console.log(err);
  }
})();

const dbPool = new Pool({ connectionString: config.db.uri });

export default {
  query: (text: string, params?: any[]) => {
    return dbPool.query(text, params);
  },

  disconnect: () => {
    dbPool.end();
  },
};
