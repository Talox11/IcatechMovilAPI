const dotenv = require('dotenv').config();

module.exports = {

  NODE_ENV: process.env.NODE_ENV || 'development',
  API_URL: process.env.API_URL || 'localhost',
  
  MYSQL_DB_USERNAME: process.env.MYSQL_DB_USERNAME || 'root',
  MYSQL_DB_HOST: process.env.MYSQL_DB_HOST || 'localhost',
  MYSQL_DB_PASSWORD: process.env.MYSQL_DB_PASSWORD || '',
  MYSQL_DB_DATABASE: process.env.MYSQL_DB_DATABASE || 'wwicat_db_auditoria',
  MYSQL_DB_PORT: process.env.MYSQL_DB_PORT || 3306,


  PG_DB_USERNAME: process.env.PG_DB_USERNAME || 'postgres',
  PG_DB_HOST: process.env.PG_DB_HOST || '127.0.0.1',
  PG_DB_PASSWORD: process.env.PG_DB_PASSWORD || '8552',
  PG_DB_DATABASE: process.env.PG_DB_DATABASE || 'lastest_sivycDB',
  PG_DB_PORT: process.env.PG_DB_PORT || 5432,

}

  