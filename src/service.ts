import user from './services/user';
import messages from './services/messages';
import friends from './services/friends';

export default () => {
    user();
    friends();
    messages();
}