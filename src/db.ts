import pg from 'pg';
import config from './config';

const pool = new pg.Pool({
    user: 'chatter',
    host: config.psqlHost,
    port: config.psqlPort,
    database: 'chatter',
    password: 'password'
});

export default pool;
