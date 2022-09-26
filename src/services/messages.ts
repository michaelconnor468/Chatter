import context from '../context';
import {Pool} from "pg";
import {Router} from 'express';

interface User {
    username: string,
    email: string,
    password: string
}

interface JWT {
    username: string,
    hash: string
}

const getErrorResponse = (e: Error) => {
    return '{"error": "Something went wrong"}'
}

export default (router: Router, db: Pool) => {
    router.post('/messages', async (req, res) => {
        try {
            const query = await db.query(`INSERT INTO "Messages" VALUES ('${req.jwt.username}', '${req.body.friend}', CURRENT_TIMESTAMP, '${req.body.message}', 'FALSE');`);
            if ( query.rowCount < 1 ) {
                res.status(404).end();
                return;
            }
            context.sockets.get(req.body.friend)?.socket.emit('message', {Sender: req.jwt.username, Receiver: req.body.friend, Message: req.body.message, Time: (new Date()).toUTCString(), Read: true});
            res.status(201).end();
        } catch (e: any) {
            console.trace(e);
            res.status(500).end(getErrorResponse(e));
        }
    });

    router.get('/messages', async (req, res) => {
        try {
            const query = await db.query(`
                SELECT *
                FROM "Messages" 
                WHERE ("Sender"='${req.jwt.username}' AND "Receiver"='${req.query.friend}') 
                    OR ("Receiver"='${req.jwt.username}' AND "Sender"='${req.query.friend}')
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
                WHERE ("Sender"='${req.jwt.username}' AND "Receiver"='${req.query.friend}') 
                    OR ("Receiver"='${req.jwt.username}' AND "Sender"='${req.query.friend}')
            `);
            res.status(201).end(JSON.stringify(query.rows));
        } catch (e: any) {
            console.trace(e);
            res.status(500).end(getErrorResponse(e));
        }
    });
}
