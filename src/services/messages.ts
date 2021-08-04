import context from '../context';
import config from '../config';
import db from '../db';

interface User {
    username: string,
    email: string,
    password: string
}

interface JWT {
    username: string,
    hash: string
}

export default () => {
    context.router.post('/messages', async (req, res) => {
        const cookies = JSON.parse(req.cookies['chatter-jwt']);
        if ( !cookies || !context.authorizeJWT(cookies) ) {
            res.status(401).end();
            return;
        }

        try {
            const query = await db.query(`INSERT INTO "Messages" VALUES ('${cookies.username}', '${req.body.friend}', CURRENT_TIMESTAMP, '${req.body.message}', 'FALSE');`);
            if ( query.rowCount < 1 ) {
                res.status(404).end();
                return;
            }
            res.status(201).end();
        } catch (e) {
            console.trace(e);
            res.status(200).end();
        }
    });

    context.router.get('/messages', async (req, res) => {
        const cookies = JSON.parse(req.cookies['chatter-jwt']);
        if ( !cookies || !context.authorizeJWT(cookies) ) {
            res.status(401).end();
            return;
        }

        try {
            const query = await db.query(`
                SELECT "Sender", "Message", "Time"
                FROM "Messages" 
                WHERE ("Sender"='${cookies.username}' AND "Receiver"='${req.body.friend}') OR ("Receiver"='${cookies.username}' AND "Sender"='${req.body.friend}')
                ORDER BY "Time" DESC
                LIMIT 20
            `);
            if ( query.rowCount < 1 ) {
                res.status(404).end();
                return;
            }
            const updateQuery = await db.query(`
                UPDATE "Messages"
                SET "Read"='TRUE'
                WHERE ("Sender"='${cookies.username}' AND "Receiver"='${req.body.friend}') OR ("Receiver"='${cookies.username}' AND "Sender"='${req.body.friend}')
            `);
            res.status(201).end(query.rows);
        } catch (e) {
            console.trace(e);
            res.status(200).end();
        }
    });
}