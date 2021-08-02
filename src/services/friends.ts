import context from "../context";
import db from '../db';

export default () => {
    context.router.get('/friends', async (req, res) => {
        if ( !req.cookies['chatter-jwt'] || !context.authorizeJWT(req.cookies['chatter-jwt']) ) {
            res.status(401).end();
            return;
        }

        try {
            const query = await db.query(`
                SELECT f1."Friend" FROM "Friends" AS f1, "Friends" AS f2 
                    WHERE f1."User"='${req.cookies['chatter-jwt'].username}' 
                        AND f2."Friend"='${req.cookies['chatter-jwt'].username}' 
                        AND f1."Friend"=f2."User";
            `);
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

    context.router.get('/friends/invites', async (req, res) => {
        if ( !req.cookies['chatter-jwt'] || !context.authorizeJWT(req.cookies['chatter-jwt']) ) {
            res.status(401).end();
            return;
        }

        try {
            const query = await db.query(`
                SELECT "User" FROM "Friends" 
                    WHERE "Friend"='${req.cookies['chatter-jwt'].username}' 
                        AND FRIEND NOT IN 
                            (SELECT "Friend" FROM "Friends" WHERE "User"='${req.cookies['chatter-jwt'].username}');
            `);
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
            const query = await db.query(`INSERT INTO "Friends" VALUES ('${req.cookies['chatter-jwt'].username}', '${req.body.username}';`);
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
            const query = await db.query(`
                DELETE FROM "Friends" WHERE 
                    ("User"='${req.cookies['chatter-jwt'].username}' AND "Friend"='${req.body.username}') 
                        OR ("User"='${req.body.username}' AND "Friend"='${req.cookies['chatter-jwt'].username}');
            `);
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