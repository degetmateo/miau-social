import { Socket } from "socket.io";
import JWT from "../../helpers/JWT";

export default async function writing (socket: Socket) {
    socket.on('writing', async (token) => {
        if (!token) return;

        try {
            const member = await JWT.Validate(token);

            socket.broadcast.emit('writing', {
                creator: {
                    name: member.name,
                    username: member.username,
                    icon_url: member.icon_url,
                    role: member.role
                }
            });
        } catch (error) {
            socket.emit('unauthorized', {
                code: 'register'
            });
        };
    });
};