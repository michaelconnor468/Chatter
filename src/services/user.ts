import context from '../context';
import db from '../db';

interface User {
    username: string,
    email: string,
    password: string
}

export default () => {
    context.router.post('/user', async (req, res) => {
        try {
            if ( !validateUser(req.body) ) throw Error;
            res.status(201).end(); // TODO send back token
        } catch (e) {
            res.status(500).end('{"error": "Something went wrong"}');
        }
    });

    context.router.post('/user/login', async (req, res) => {
        try {
            res.status(201).end(); // TODO send back token
        } catch (e) {
            res.status(500).end('{"error": "Something went wrong"}');
        }
    });
};

const validateUser = (user: User): boolean => {
    if ( !user.password.match(/^[a-z0-9A-Z\.\_\-]{6,20}$/) ) return false;
    if ( !user.username.match(/^[a-z0-9A-Z\.\_\-]{1,20}$/) ) return false;
    if ( !user.email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/) ) return false;
    return true;
}