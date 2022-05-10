import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  old_development: {
    client: "sqlite3",
    connection: {
      filename: "./db/dev.sqlite3"
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./src/data/migrations"
    },
    seeds: {
      directory: "./src/data/seeds"
    }
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  development: {
    client: "pg",
    connection: process.env.DATABASE || "postgresql://vigilant:cloud@127.0.0.1:5432/vigilant-cloud",
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
