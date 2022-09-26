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
            const query = await db.query(`INSERT INTO "Messages" VALUES ('$1', '$2', CURRENT_TIMESTAMP, '$3', 'FALSE');`, [req.jwt.username, req.body.friend, req.body.message]);
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
                WHERE ("Sender"='$1' AND "Receiver"='$2') 
                    OR ("Receiver"='$1' AND "Sender"='$2')
                ORDER BY "Time" DESC
                LIMIT 20
            `, [req.jwt.username, req.query.friend]);
            if ( query.rowCount < 1 ) {
                res.status(404).end();
                return;
            }
            const updateQuery = await db.query(`
                UPDATE "Messages"
                SET "Read"='TRUE'
                WHERE ("Sender"='$1' AND "Receiver"='$2') 
                    OR ("Receiver"='$1' AND "Sender"='$2')
            `, [req.jwt.username, req.query.friend]);
            res.status(201).end(JSON.stringify(query.rows));
        } catch (e: any) {
            console.trace(e);
            res.status(500).end(getErrorResponse(e));
        }
    });
}
