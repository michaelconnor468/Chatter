import context from "../context";
import {Pool} from "pg";
import {Router} from 'express';

const getErrorResponse = (e: Error) => {
    return '{"error": "Something went wrong"}'
}

export default (router: Router, db: Pool) => {
    router.get('/friends', async (req, res) => {
        try {
            const query = await db.query(`
                SELECT f1."Friend" FROM "Friends" AS f1, "Friends" AS f2 
                    WHERE f1."User"='$1' 
                        AND f2."Friend"='$1' 
                        AND f1."Friend"=f2."User";
            `, [req.jwt.username]);
            if ( query.rowCount < 1 ) {
                res.status(200).end('[]');
                return;
            }
            res.status(200).end(JSON.stringify(query.rows));
        } catch (e: any) {
            console.trace(e);
            res.status(500).end(getErrorResponse(e));
        }
    });

    router.get('/friends/invites', async (req, res) => {
        try {
            const query = await db.query(`
                SELECT "User" FROM "Friends" 
                    WHERE "Friend"='$1' 
                        AND "User" NOT IN 
                            (SELECT "Friend" FROM "Friends" WHERE "User"='$1');
            `, [req.jwt.username]);
            res.status(200).end(JSON.stringify(query.rows));
        } catch (e: any) {
            console.trace(e);
            res.status(500).end(getErrorResponse(e));
        }
    });

    router.post('/friends', async (req, res) => {
        try {
            if ( req.jwt.username === req.body.username ) {
                res.status(201).end();
                return;
            }
            const query = await db.query(`INSERT INTO "Friends" VALUES ('$1', '$2');`, [req.jwt.username, req.body.username]);
            if ( query.rowCount < 1 ) {
                res.status(404).end();
                return;
            }
            res.status(201).end();
        } catch (e: any) {
            console.trace(e);
            res.status(200).end();
        }
    });

    router.delete('/friends', async (req, res) => {
        try {
            const query = await db.query(`
                DELETE FROM "Friends" WHERE 
                    ("User"='$1' AND "Friend"='$2') 
                        OR ("User"='$2' AND "Friend"='$1');
            `, [req.jwt.username, req.body.username]);
            if ( query.rowCount < 1 ) {
                res.status(404).end();
                return;
            }
            res.status(201).end();
        } catch (e: any) {
            console.trace(e);
            res.status(500).end(getErrorResponse(e));
        }
    });
};
