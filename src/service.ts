import user from './services/user';
import messages from './services/messages';
import friends from './services/friends';
import webrtc from './services/webrtc';
import context from './context'

export default () => {
    user(context.router);
    friends(context.router);
    messages(context.router);
    webrtc(context.router);
}
