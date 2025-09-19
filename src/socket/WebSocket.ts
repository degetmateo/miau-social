import http from 'http';
import { Server } from "socket.io";
import register from './routes/register';
import privateMessage from './routes/message';

class WebSocket {
    public io: Server;

    public members: Map<string, Map<string, {
      name: string;
      username: string;
      icon_url: string;
      role: string;
    }>>;

    public logs: Map<string, Record<string, number[]>>;
    public cooldowns: Map<string, Record<string, number>>;

    public messages: Array<{
      content: string;
      creator: {
        name: string;
        username: string;
        icon_url: string;
        role: string;
      }
    }>;

    constructor () {
        this.members = new Map<string, Map<string, {
          name: string;
          username: string;
          icon_url: string;
          role: string;
        }>>();

        this.logs = new Map<string, Record<string, number[]>>();
        this.cooldowns = new Map<string, Record<string, number>>();

        this.messages = new Array<{
          content: string;
          creator: {
            name: string;
            username: string;
            icon_url: string;
            role: string;
          }
        }>();
    };

    isRateLimited (memberId: string, action: string): boolean {
      const now = Date.now();
      const cd = this.cooldowns.get(memberId)?.['message'];
      if (cd && now < cd) return true;
      if (!this.logs.has(memberId)) this.logs.set(memberId, {});
      const actions = this.logs.get(memberId)!;
      if (!actions['message']) actions['message'] = [];
      actions['message'] =  actions['message'].filter(ts => now - ts < 5000);
      actions['message'].push(now);

      if (actions['message'].length > 6) {
        if (!this.cooldowns.has(memberId)) this.cooldowns.set(memberId, {});
        this.cooldowns.get(memberId)!['message'] = now + 10000;
        return true;
      };
      return false;
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
          privateMessage(socket);
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