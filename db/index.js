const { db } = require('../config');
const { Pool } = require('pg');

const dbPool = new Pool({ connectionString: db.uri });

module.exports = {
  db: {
    query: (text, params, callback) => {
      return dbPool.query(text, params, callback);
    },

    disconnect: () => {
      dbPool.end();
    },
  },
};
