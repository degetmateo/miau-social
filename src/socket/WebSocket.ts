import http from 'http';
import { Server } from "socket.io";
import register from './routes/register';
import message from './routes/message';
import disconnect from './routes/disconnect';
import writing from './routes/writing';

export default class WebSocket {
    public readonly io: Server;
    public users: any[];
    public messages: any[];

    public members: Map<string, Map<string, {
      name: string;
      username: string;
      icon_url: string;
      role: string;
    }>>;

    constructor (server: http.Server) {
        this.members = new Map<string, Map<string, {
          name: string;
          username: string;
          icon_url: string;
          role: string;
        }>>();

        this.io = new Server(server, {
          cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
          }
        });

        this.messages = new Array<any>();

        this.io.on('connection', (socket) => {
          register(this, this.io, socket);
          message(this, this.io, socket);
          writing(this, this.io, socket);
          disconnect(this, this.io, socket);
        });
    };
};