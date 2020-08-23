import { Socket } from 'socket.io';

declare const socket: Socket;

socket.on('log', msg => console.log(msg));