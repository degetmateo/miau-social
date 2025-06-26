import { Socket } from "socket.io";
import JWT from "../../helpers/JWT";
import WebSocket from "../WebSocket";
import disconnect from "./disconnect";
import { RESPONSES } from "../../static/responses";
import { ResponseError, ResponseOk } from "../ControllerResponse";

export default async function register (socket: Socket) {
    socket.on('register', async (data: {
        token: string;
    }, func: Function) => {
        try {
            const member = await JWT.Validate(data.token);

            if (!WebSocket.members.has(member.id)) WebSocket.members.set(member.id, new Map());
            
            WebSocket.members.get(member.id).set(socket.id, {
                name: member.name,
                username: member.username,
                icon_url: member.icon_url,
                role: member.role
            });

            disconnect(socket, member.id);
            ResponseOk(func, null, RESPONSES.OK);
        } catch (error) {
            ResponseError(func, error);
        };
    });
};