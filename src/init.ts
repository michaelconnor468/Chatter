import express from 'express';
import http from 'http';
import path from 'path';
import config from './config'

const PORT: number = config.port;
const app = express();

app.use(express.static('client/dist'));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
