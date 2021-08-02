import context from "../context";
import db from '../db';

export default () => {
    context.router.get('/friends', async (req, res) => {
        if ( !req.cookies['chatter-jwt'] || !context.authorizeJWT(req.cookies['chatter-jwt']) ) {
            res.status(401).end();
            return;
        }

        try {
            const query = await db.query(`SELECT "User" FROM "Friends" WHERE "User"='${req.body.user}' OR "Friend"='${req.body.user}'`);
            if ( query.rowCount < 1 ) {
                res.status(200).end('[]');
                return;
            }
            res.status(200).end(JSON.stringify(query.rows));
        } catch (e) {
            console.trace(e);
            res.status(500).end('{"error": "Something went wrong"}');
        }
    });

    context.router.post('/friends', async (req, res) => {
        if ( !req.cookies['chatter-jwt'] || !context.authorizeJWT(req.cookies['chatter-jwt']) ) {
            res.status(401).end();
            return;
        }

        try {
            const query = await db.query(`INSERT INTO "Friends" VALUES ('${req.body.user}', '${req.body.friend}'`);
            if ( query.rowCount < 1 ) {
                res.status(404).end();
                return;
            }
            res.status(201).end();
        } catch (e) {
            console.trace(e);
            res.status(500).end('{"error": "Something went wrong"}');
        }
    });

    context.router.delete('/friends', async (req, res) => {
        if ( !req.cookies['chatter-jwt'] || !context.authorizeJWT(req.cookies['chatter-jwt']) ) {
            res.status(401).end();
            return;
        }

        try {
            const query = await db.query(`DELETE FROM "Friends" WHERE "User"='${req.body.user}' AND "Friend"='${req.body.friend}'`);
            if ( query.rowCount < 1 ) {
                res.status(404).end();
                return;
            }
            res.status(201).end();
        } catch (e) {
            console.trace(e);
            res.status(500).end('{"error": "Something went wrong"}');
        }
    });
};