import context from '../context';
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

export default () => {

}