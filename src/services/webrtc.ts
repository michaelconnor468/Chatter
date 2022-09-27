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
        // TODO for creating webrtc sessions from a given user
        try {
            if ( req.jwt.username === req.body.username ) {
                res.status(201).end();
                return;
            }
            const query = await db.query(`TODO QUERY HERE`, []);
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
        // TODO return non-expired webrtc sessions related to a given user
        try {
            const query = await db.query(`
                TODO QUERY HERE
            `, []);
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
