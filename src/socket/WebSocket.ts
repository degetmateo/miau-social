import http from 'http';
import { Server } from "socket.io";
import register from './routes/register';
import message from './routes/message';
import disconnect from './routes/disconnect';

export default class WebSocket {
    public readonly io: Server;
    public users: any[];

    constructor (server: http.Server) {
        this.io = new Server(server, {
          cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
          }
        });

        this.users = new Array<any>();

        this.io.on('connection', (socket) => {
          register(this, this.io, socket);
          message(this, this.io, socket);
          disconnect(this, this.io, socket);
        });
    };
};