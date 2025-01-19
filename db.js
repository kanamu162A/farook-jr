require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER

});

pool.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message); // Log detailed error
  } else {
    console.log('Database Connected Successfully');
  }
});

module.exports = pool;
