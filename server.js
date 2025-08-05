import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import path from 'path';
import {Server as socketIo} from 'socket.io';
import { fileURLToPath } from 'url';
import { setSocketInstance } from './sockets/utils/socketEmitter.js'; // <-- ADD THIS

import webRoutes from './routes/web.js';
import apiRoutes from './routes/api.js';


import sequelize from './models/index.js';
import registerSockets from './sockets/index.js';


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

registerSockets(io);
setSocketInstance(io);
sequelize.sync();
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});