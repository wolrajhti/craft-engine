import http from 'http';
import express from 'express';
import socket from 'socket.io';
import { GameServer } from './game-server';

const app = express();
const server = http.createServer(app);
const io = socket(server);

io.on('connection', socket => new GameServer(socket));

app.use(express.static('./client/public'));
app.use(express.static('./dist/app/client'));

server.listen(3000);

server.on('listening', () => {
  console.log('listening on port', 3000);
});
