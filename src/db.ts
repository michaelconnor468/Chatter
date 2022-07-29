import pg from 'pg';
import config from './config';

const pool = new pg.Pool({
    user: 'chatter',
    host: 'localhost',
    port: config.psqlPort,
    database: 'chatter'
});

export default pool;
