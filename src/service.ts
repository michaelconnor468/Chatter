import user from './services/user';
import friends from './services/friends';

export default () => {
    user();
    friends();
}