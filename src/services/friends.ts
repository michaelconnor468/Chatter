import context from "../context";
import {Router} from 'express';
import db from '../db';
import config from '../config';

const getErrorResponse = (e: Error) => {
    return '{"error": "Something went wrong"}'
}

export default (router: Router) => {
    router.get('/friends', async (req, res) => {
        if ( !req.cookies ) {
            res.status(401).end();
            return;
        }
        const cookies = JSON.parse(req.cookies['chatter-jwt']);

        if ( !cookies || !context.authorizeJWT(cookies) ) {
            res.status(401).end();
            return;
        }

        try {
            const query = await db.query(`
                SELECT f1."Friend" FROM "Friends" AS f1, "Friends" AS f2 
                    WHERE f1."User"='${cookies.username}' 
                        AND f2."Friend"='${cookies.username}' 
                        AND f1."Friend"=f2."User";
            `);
            if ( query.rowCount < 1 ) {
                res.status(200).end('[]');
                return;
            }
            res.status(200).end(JSON.stringify(query.rows));
        } catch (e) {
            console.trace(e);
            res.status(500).end(getErrorResponse(e));
        }
    });

    router.get('/friends/invites', async (req, res) => {
        if ( !req.cookies ) {
            res.status(401).end();
            return;
        }
        const cookies = JSON.parse(req.cookies['chatter-jwt']);
        if ( !cookies || !context.authorizeJWT(cookies) ) {
            res.status(401).end();
            return;
        }

        try {
            const query = await db.query(`
                SELECT "User" FROM "Friends" 
                    WHERE "Friend"='${cookies.username}' 
                        AND "User" NOT IN 
                            (SELECT "Friend" FROM "Friends" WHERE "User"='${cookies.username}');
            `);
            res.status(200).end(JSON.stringify(query.rows));
        } catch (e) {
            console.trace(e);
            res.status(500).end(getErrorResponse(e));
        }
    });

    router.post('/friends', async (req, res) => {
        if ( !req.cookies ) {
            res.status(401).end();
            return;
        }
        const cookies = JSON.parse(req.cookies['chatter-jwt']);
        if ( !cookies || !context.authorizeJWT(cookies) ) {
            res.status(401).end();
            return;
        }

        try {
            if ( cookies.username === req.body.username ) {
                res.status(201).end();
                return;
            }
            const query = await db.query(`INSERT INTO "Friends" VALUES ('${cookies.username}', '${req.body.username}');`);
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

    router.delete('/friends', async (req, res) => {
        if ( !req.cookies ) {
            res.status(401).end();
            return;
        }
        const cookies = JSON.parse(req.cookies['chatter-jwt']);
        if ( !cookies || !context.authorizeJWT(cookies) ) {
            res.status(401).end();
            return;
        }

        try {
            const query = await db.query(`
                DELETE FROM "Friends" WHERE 
                    ("User"='${(cookies).username}' AND "Friend"='${req.body.username}') 
                        OR ("User"='${req.body.username}' AND "Friend"='${cookies.username}');
            `);
            if ( query.rowCount < 1 ) {
                res.status(404).end();
                return;
            }
            res.status(201).end();
        } catch (e) {
            console.trace(e);
            res.status(500).end(getErrorResponse(e));
        }
    });
};
