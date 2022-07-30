import user from './services/user';
import messages from './services/messages';
import friends from './services/friends';
import webrtc from './services/webrtc';
import {Router} from 'express';
import {Pool} from 'pg';

export default (router: Router, pool: Pool) => {
    user(router, pool);
    friends(router, pool);
    messages(router, pool);
    webrtc(router, pool);
}
