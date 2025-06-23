import http from 'http';
import { Server } from "socket.io";
import register from './routes/register';
import message from './routes/message';
import disconnect from './routes/disconnect';
import writing from './routes/writing';

class WebSocket {
    public io: Server;
    public users: any[];
    public messages: any[];

    public members: Map<string, Map<string, {
      name: string;
      username: string;
      icon_url: string;
      role: string;
    }>>;

    constructor () {
        this.members = new Map<string, Map<string, {
          name: string;
          username: string;
          icon_url: string;
          role: string;
        }>>();

        this.messages = new Array<any>();
    };

    Initialize (server: http.Server) {
        this.io = new Server(server, {
          cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
          }
        });


        this.io.on('connection', (socket) => {
          register(socket);
          message(socket);
          writing(socket);
          disconnect(socket);
        });
    };
};

export default new WebSocket();