import { Socket } from "socket.io";
import JWT from "../../helpers/JWT";
import WebSocket from "../WebSocket";
import disconnect from "./disconnect";

export default async function register (socket: Socket) {
    socket.on('register', async (token: string) => {
        try {
            const member = await JWT.Validate(token);
            
            if (!WebSocket.members.has(member.id)) WebSocket.members.set(member.id, new Map());
            
            WebSocket.members.get(member.id).set(socket.id, {
                name: member.name,
                username: member.username,
                icon_url: member.icon_url,
                role: member.role,
                token: token
            });

            disconnect(socket, member.id);
        } catch (error) {
            socket.emit('unauthorized', {
                code: 'register'
            });
        };
    });
};