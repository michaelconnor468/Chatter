import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { Server } from 'socket.io';
import context from './context';
import config from './config';
import pool from './db';
import service from './service';
import cookieParser from 'cookie-parser';

const PORT: number = config.port;
const app = context.router;

app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(express.static('client/dist'));

service();

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', socket => {
  const cookie = socket.handshake.headers.cookie;
  if ( !cookie ) return;
  const jwt = JSON.parse(context.getCookie('chatter-jwt', decodeURIComponent(cookie)));
  if ( context.authorizeJWT(jwt) )
    context.sockets.set(jwt.username, 
      {
        socket: socket, 
        timer: setTimeout(() => {socket.disconnect(true); context.sockets.delete(jwt.username);}, 1000*60*15)
      }
    );
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
