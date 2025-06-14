import { DefaultEventsMap, Server, Socket } from "socket.io";
import WebSocket from "../WebSocket";

export default async function disconnect (
    ws: WebSocket,
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
    socket: Socket
) {
    socket.on('disconnect', () => {
        const member = ws.users.find(u => u?.id == socket.id);

        if (!member) return;
        if (!member.username) return;

        socket.broadcast.emit('user-disconnect', {
            name: member.name,
            username: member.username,
            icon_url: member.icon_url,
            role: member.role
        });
    });
};