import { Knex } from "knex";

interface IKnexConfig {
  [key: string]: Knex.Config
}

const config: IKnexConfig = {
  test: {
    client: "sqlite3",
    connection: {
      filename: "./src/database/dev.sqlite3"
    },
    debug: true,
    useNullAsDefault: true,
  },

  development: {
    client: "sqlite3",
    connection: {
      filename: "./src/database/dev.sqlite3"
    },
    debug: true,
    useNullAsDefault: true,
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "postgres",
      user: "postgres",
      password: "mysecretpassword"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

export default config;
