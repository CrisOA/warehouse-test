import knex from 'knex';
import configs from './knexfile';


const runningEnv = process.env.NODE_ENV || 'development'

const config = configs[runningEnv];

const db = knex(config);

export default db;
