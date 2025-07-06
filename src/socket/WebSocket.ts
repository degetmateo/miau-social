import http from 'http';
import { Server } from "socket.io";
import register from './routes/register';
import message from './routes/message';
import writing from './routes/writing';
import ChatsRouter from './routes/chats';

class WebSocket {
    public io: Server;

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
          ChatsRouter(socket);
          // message(socket);
          // writing(socket);
        });
    };

    emitNotification (data: {
      memberId: string;
      notification: any;
    }) {
      try {
        const member = this.members.get(data.memberId);
        if (!member) return;
              
        const sockets = member.entries();
        for (const socket of sockets) {
            const socketId = socket[0];
            this.io.to(socketId).emit('socket-notification', data.notification);
        };
      } catch (error) {
        console.error(error);
      };
    };

    EmitNewPost (data: any) {
      try {
        this.io.emit('socket-new-post', data);
      } catch (error) {
        console.error(error);
      };
    };
};

export default new WebSocket();