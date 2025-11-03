import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  user: process.env.DB_USER || 'equiptrack_user',
  password: process.env.DB_PASS || 'Aprbfe1889',
  database: process.env.DB_NAME || 'equiptrack',
  port: process.env.DB_PORT || 5432,
});
