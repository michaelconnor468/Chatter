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
    router.post('/webrtc', async (req, res) => {
        try {
            if ( req.jwt.username === req.body.username ) {
                res.status(201).end();
                return;
            }
            const query = await db.query(`
                INSERT INTO "VideoRoom" 
                VALUES ($1, $2, $3, to_timestamp($4 / 1000.0), FALSE);
            `, [req.jwt.username, req.body.username, req.body.offer, new Date(Date.now() + 5*60000)]);
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

    router.get('/webrtc', async (req, res) => {
        try {
            const query = await db.query(`
                SELECT "Offer"
                FROM "VideoRoom"
                WHERE "Guest"=$1 AND "Expired"=FALSE AND to_timestamp($2 / 1000.0)<"Expiry"

            `, [req.jwt.username, Date.now()]);
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
}
