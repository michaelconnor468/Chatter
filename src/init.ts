import express from "express";
import http from "http";
import path from "path";

const PORT: number = 8000;
const app = express();

app.use(express.static('client/dist'));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
