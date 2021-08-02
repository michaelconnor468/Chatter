import express from 'express';
import bcrypt from 'bcrypt';
import config from './config';
import { authenticate } from 'passport';

export default {
    router: express(),
    authorizeJWT: async (jwt: {username: string, hash: string}) => {
        let hashedJWT = jwt.username;
        for ( let i = 0; i < 5; i++ ) hashedJWT = await bcrypt.hash(hashedJWT, config.jwtkey);
        return jwt.hash === hashedJWT;
    }
}