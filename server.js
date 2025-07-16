import dotenv from 'dotenv';
dotenv.config({ debug: true });
console.log("DB info loaded:", {
  user: process.env.DB_USERNAME,
  pass: process.env.DB_PASSWORD,
  db: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
});

import express from 'express';
import http from 'http';
import path from 'path';
import {Server as socketIo} from 'socket.io';
import { fileURLToPath } from 'url';

import webRoutes from './routes/web.js';
import apiRoutes from './routes/api.js';


import sequelize from './models/index.js';
import chatSocket from './sockets/chatsocket.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new socketIo(server);



// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const PORT = 3000;

app.use(express.json());
app.use('/',webRoutes);
app.use('/api',apiRoutes);

chatSocket(io);
sequelize.sync();
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});