import path from 'path';
import type { Knex } from "knex";
import logger from './src/api/common/logger'

try {
  require('dotenv').config();
} catch {
  logger.info('*Knex* [production mode]');
}
// Update with your config settings.

const config: { [key: string]: Knex.Config } = {

  docker: {
    client: 'sqlite3',
    connection: {
      filename: path.join(process.cwd(), 'db', 'dev.sqlite3')
    },
    migrations: {
      directory: "./src/data/migrations",
      tableName: "migrations"
    },
    seeds: {
      directory: "./src/data/seeds"
    },
    useNullAsDefault: true
  },

  development: {
    client: "pg",
    connection: "postgresql://vigilant:cloud@127.0.0.1:5432/vigilant-cloud",
    migrations: {
      directory: "./src/data/migrations",
      tableName: "migrations"
    },
    seeds: {
      directory: "./src/data/seeds"
    }
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./src/data/migrations",
      tableName: "migrations"
    },
    seeds: {
      directory: "./src/data/seeds"
    }
  }

};

module.exports = config;
