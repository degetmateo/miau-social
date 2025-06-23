import { Socket } from "socket.io";
import JWT from "../../helpers/JWT";
import WebSocket from "../WebSocket";

export default async function register (socket: Socket) {
    socket.on('register', async (token: string) => {
        try {
            const member = await JWT.Validate(token);
            
            if (!WebSocket.members.has(member.id)) WebSocket.members.set(member.id, new Map());
            
            WebSocket.members.get(member.id).set(socket.id, {
                name: member.name,
                username: member.username,
                icon_url: member.icon_url,
                role: member.role
            });

            socket.on('disconnect', () => {
                const sockets = WebSocket.members.get(member.id);

                if (sockets) {
                    sockets.delete(socket.id);
                    if (sockets.size === 0) WebSocket.members.delete(member.id);
                };
            });

            socket.emit('messages', WebSocket.messages);
        } catch (error) {
            socket.emit('unauthorized', {
                code: 'register'
            });
        };
    });
};