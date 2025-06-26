import { Socket } from "socket.io";
import JWT from "../../helpers/JWT";
import WebSocket from "../WebSocket";
import { ResponseError, ResponseOk } from "../ControllerResponse";

export default async function message (socket: Socket) {
    socket.on('socket-message', async (data: any, func: Function) => {        
        try {
            if (!data) return;
            if (!data.token) return;
            if (!data.content) return;
            if (!data.content.trim()) return;
            if (data.content.length > 512) return;
            
            const member = await JWT.Validate(data.token);

            WebSocket.io.emit('socket-message', {
                creator: {
                    name: member.name,
                    username: member.username,
                    icon_url: member.icon_url,
                    role: member.role
                },
                content: data.content
            });

            ResponseOk(func);
        } catch (error) {
            ResponseError(func, error);
        };
    }); 
};