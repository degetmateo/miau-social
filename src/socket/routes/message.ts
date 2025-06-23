import { DefaultEventsMap, Server, Socket } from "socket.io";
import JWT from "../../helpers/JWT";
import WebSocket from "../WebSocket";
import UnauthorizedError from "../../errors/UnauthorizedError";

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

            WebSocket.messages.push({
                creator: {
                    name: member.name,
                    username: member.username,
                    icon_url: member.icon_url,
                    role: member.role
                },
                content: message.content
            });

            if (WebSocket.messages.length > 50) {
                WebSocket.messages.shift();
            };
        } catch (error) {
            socket.emit('unauthorized', {
                code: 'message',
                content: message.content
            });
        };
    }); 
};