import pg from 'pg';
import config from './config';

const pool = new pg.Pool({
    user: 'chatter',
    host: 'localhost',
    port: config.port,
    database: 'chatter'
});

export default pool;