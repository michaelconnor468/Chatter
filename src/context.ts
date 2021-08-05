import express from 'express';
import io from 'socket.io';
import bcrypt from 'bcrypt';
import config from './config';

export default {
    router: express(),
    authorizeJWT: async (jwt: {username: string, hash: string}) => {
        let hashedJWT = jwt.username;
        for ( let i = 0; i < 5; i++ ) hashedJWT = await bcrypt.hash(hashedJWT, config.jwtkey);
        return jwt.hash === hashedJWT;
    },
    sockets: new Map<string, {socket: io.Socket, timer: ReturnType<typeof setTimeout>}>(),
    getCookie: (cname: string, cookie: string) => {
        let name = cname + '=';
        let decodedCookie = cookie;
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return '';
    }
}