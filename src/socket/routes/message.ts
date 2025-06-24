import { Socket } from "socket.io";
import JWT from "../../helpers/JWT";
import WebSocket from "../WebSocket";

export default async function message (socket: Socket) {
    socket.on('chat-message', async (message) => {
        if (!message) return;
        if (!message.token) return;
        if (!message.content) return;
        if (message.content.length > 512) return;

        try {
            const member = await JWT.Validate(message.token);

            WebSocket.io.emit('chat-message', {
                creator: {
                    name: member.name,
                    username: member.username,
                    icon_url: member.icon_url,
                    role: member.role
                },
                content: message.content
            });
        } catch (error) {
            socket.emit('unauthorized', {
                code: 'message',
                content: message.content
            });
        };
    }); 
};