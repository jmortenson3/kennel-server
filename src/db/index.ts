import { Pool } from 'pg';
import config from '../../config';

const dbPool = new Pool({ connectionString: config.db.uri });

export default {
  query: (text: string, params?: any[]) => {
    return dbPool.query(text, params);
  },

  disconnect: () => {
    dbPool.end();
  },
};
