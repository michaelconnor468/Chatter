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
    });

    router.get('/webrtc', async (req, res) => {
        // TODO return non-expired webrtc sessions related to a given user
    });
}
