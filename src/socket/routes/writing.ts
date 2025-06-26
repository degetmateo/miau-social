import { Socket } from "socket.io";
import JWT from "../../helpers/JWT";
import { ResponseError, ResponseOk } from "../ControllerResponse";

export default async function writing (socket: Socket) {
    socket.on('socket-writing', async (data: any, func: Function) => {
        try {
            if (!data) return;
            if (!data.token) return;
            if (!data.token.trim()) return;

            const member = await JWT.Validate(data.token);

            socket.broadcast.emit('socket-writing', {
                creator: {
                    name: member.name,
                    username: member.username,
                    icon_url: member.icon_url,
                    role: member.role
                }
            });

            ResponseOk(func);
        } catch (error) {
            ResponseError(func, error);
        };
    });
};