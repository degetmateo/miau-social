import { Socket } from "socket.io";
import WebSocket from "../WebSocket";

export default async function disconnect (socket: Socket, memberId: string) {
    socket.on('disconnect', () => {
        const sockets = WebSocket.members.get(memberId);

        if (sockets) {
            sockets.delete(socket.id);
            if (sockets.size === 0) WebSocket.members.delete(memberId);
        };
    });
};