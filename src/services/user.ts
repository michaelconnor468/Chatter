import context from '../context';
import config from '../config';
import bcrypt from 'bcrypt';
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
    context.router.post('/user', async (req, res) => {
        try {
            if ( !validateUser(req.body, true) ) {
                res.status(500).end('{"error": "Invalid user fields"}');
                return;
            }
            const hashedPassword = await hashPassword(req.body);
            const userQuery = await db.query(`SELECT "Username" FROM "Users" WHERE "Users"."Username"='${req.body.username}'`);
            if ( userQuery.rowCount > 0 ) {
                res.status(500).end('{"error": "Username already taken"}');
                return;
            }
            const emailQuery = await db.query(`SELECT "Email" FROM "Users" WHERE "Users"."Email"='${req.body.email}'`);
            if ( emailQuery.rowCount > 0 ) {
                res.status(500).end('{"error": "Email already taken"}');
                return;
            }
            const insertQuery = await db.query(`INSERT INTO "Users" VALUES ('${req.body.username}', '${req.body.email}', '${hashedPassword.password}', '${hashedPassword.salt}');`);
            if ( insertQuery.rowCount < 1 ) {
                res.status(500).end('{"error": "Email already taken"}');
                return;
            }
            const jwt = JSON.stringify({username: req.body.username, hash: (await hashJWT({username: req.body.username, hash: ''}))});
            res.cookie('chatter-jwt', jwt, { maxAge: 60*60*1000 })
            res.status(201).end(jwt);
        } catch (e) {
            console.trace(e);
            res.status(500).end('{"error": "Something went wrong"}');
        }
    });

    context.router.post('/user/login', async (req, res) => {
        try {
            if ( !validateUser(req.body, false) ) throw Error('Invalid user data');
            const userQuery = await db.query(`SELECT * FROM "Users" WHERE "Users"."Username"='${req.body.username}'`);
            if ( userQuery.rowCount < 1 ) {
                res.status(500).end('{"error": "Username does not exist"}');
                return;
            }
            if ( (await hashPassword(req.body, Object(userQuery.rows[0])['PasswordSalt'])).password !== Object(userQuery.rows[0])['Password'] ) {
                console.log(await hashPassword(req.body, Object(userQuery.rows[0])['PasswordSalt']));
                console.log(Object(userQuery.rows[0])['Password']);
                res.status(500).end('{"error": "Password is incorrect"}');
                return;
            }
            const jwt = JSON.stringify({username: req.body.username, hash: (await hashJWT({username: req.body.username, hash: ''}))});
            res.cookie('chatter-jwt', jwt, { maxAge: 60*60*1000 })
            res.status(201).end(jwt);
        } catch (e) {
            console.trace(e);
            res.status(500).end('{"error": "Something went wrong"}');
        }
    });
};

const validateUser = (user: User, email: boolean): boolean => {
    if ( !user.password.match(/^[a-z0-9A-Z\.\_\-]{6,20}$/) ) return false;
    if ( !user.username.match(/^[a-z0-9A-Z\.\_\-]{1,20}$/) ) return false;
    if ( email && !user.email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/) ) return false;
    return true;
}

const hashPassword = async (user: User, salt?: string) => {
    if ( !salt ) salt = await bcrypt.genSalt(10);
    let hashedPassword = user.password;
    for ( let i = 0; i < 5; i++ ) hashedPassword = await bcrypt.hash(hashedPassword, salt);
    return { password: hashedPassword, salt };
}

const authorizeJWT = async (jwt: JWT) => {
    let hashedJWT = jwt.username;
    for ( let i = 0; i < 5; i++ ) hashedJWT = await bcrypt.hash(hashedJWT, config.jwtkey);
    return jwt.hash === hashedJWT;
}

const hashJWT = async (jwt: JWT) => {
    let hashedJWT = jwt.username;
    for ( let i = 0; i < 5; i++ ) hashedJWT = await bcrypt.hash(hashedJWT, config.jwtkey);
    jwt.hash = hashedJWT;
    return jwt;
}