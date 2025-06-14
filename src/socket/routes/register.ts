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
            
            ws.users[Number(member.id)] = {
                id: socket.id,
                name: member.name,
                username: member.username,
                icon_url: member.icon_url,
                role: member.role
            };

            socket.broadcast.emit('user-connect', {
                username: member.username
            });
        } catch (error) {
            socket.emit('unauthorized', {
                code: 'register'
            });
        };
    });
};