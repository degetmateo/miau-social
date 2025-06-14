import { DefaultEventsMap, Server, Socket } from "socket.io";
import JWT from "../../helpers/JWT";
import WebSocket from "../WebSocket";

export default async function message (
    ws: WebSocket,
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
    socket: Socket
) {
    socket.on('chat-message', async (message) => {
        if (!message) return;
        if (!message.token) return;
        if (!message.content) return;
        if (message.content.length > 512) return;

        try {
            const member = await JWT.Validate(message.token);

            io.emit('chat-message', {
                creator: {
                    name: member.name,
                    username: member.username,
                    icon_url: member.icon_url,
                    role: member.role
                },
                content: message.content
            });

            ws.messages.push({
                creator: {
                    name: member.name,
                    username: member.username,
                    icon_url: member.icon_url,
                    role: member.role
                },
                content: message.content
            });

            if (ws.messages.length > 50) {
                ws.messages.shift();
            };
        } catch (error) {
            socket.emit('unauthorized', {
                code: 'message',
                content: message.content
            });
        };
    }); 
};