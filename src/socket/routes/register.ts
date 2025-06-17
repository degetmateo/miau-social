import { DefaultEventsMap, Server, Socket } from "socket.io";
import JWT from "../../helpers/JWT";
import WebSocket from "../WebSocket";

export default async function register (
    ws: WebSocket,
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
    socket: Socket
) {
    socket.on('register', async (token: string) => {
        try {
            const member = await JWT.Validate(token);
            
            if (!ws.members.has(member.id)) ws.members.set(member.id, new Map());
            
            ws.members.get(member.id).set(socket.id, {
                name: member.name,
                username: member.username,
                icon_url: member.icon_url,
                role: member.role
            });

            socket.on('disconnect', () => {
                const sockets = ws.members.get(member.id);

                if (sockets) {
                    sockets.delete(socket.id);
                    if (sockets.size === 0) ws.members.delete(member.id);
                };
            });

            socket.emit('messages', ws.messages);
        } catch (error) {
            socket.emit('unauthorized', {
                code: 'register'
            });
        };
    });
};