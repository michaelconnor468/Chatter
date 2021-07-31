import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import context from './context';
import config from './config';
import pool from './db';
import service from './service';

const PORT: number = config.port;
const app = context.router;

app.use(cors());
app.use(express.json());
app.use(express.static('client/dist'));

service();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
