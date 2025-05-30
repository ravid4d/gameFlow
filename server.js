import express from 'express';
import http from 'http';
import path from 'path';
import {Server as socketIo} from 'socket.io';
import { fileURLToPath } from 'url';
import webRoutes from './routes/web.js';

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

app.use('/',webRoutes);

chatSocket(io);
sequelize.sync();
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});