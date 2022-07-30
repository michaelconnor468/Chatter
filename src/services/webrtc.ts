import context from '../context';
import {Router} from 'express';
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

const getErrorResponse = (e: Error) => {
    return '{"error": "Something went wrong"}'
}

export default (router: Router) => {
    router.post('/webrtc', async (req, res) => {
        if ( !req.cookies ) {
            res.status(401).end();
            return;
        }
        const cookies = JSON.parse(req.cookies['chatter-jwt']);
        if ( !cookies || !context.authorizeJWT(cookies) ) {
            res.status(401).end();
            return;
        }
        // TODO for creating webrtc sessions from a given user
    });

    router.get('/webrtc', async (req, res) => {
        if ( !req.cookies ) {
            res.status(401).end();
            return;
        }
        const cookies = JSON.parse(req.cookies['chatter-jwt']);
        if ( !cookies || !context.authorizeJWT(cookies) ) {
            res.status(401).end();
            return;
        }
        // TODO return non-expired webrtc sessions related to a given user
    });
}
