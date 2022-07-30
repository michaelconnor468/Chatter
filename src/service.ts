import user from './services/user';
import messages from './services/messages';
import friends from './services/friends';
import webrtc from './services/webrtc';
import {Router} from 'express';

export default (router: Router) => {
    user(router);
    friends(router);
    messages(router);
    webrtc(router);
}
