import { Socket } from "socket.io";
import { ResponseError, ResponseOk } from "../ControllerResponse";
import Postgres from "../../database/Postgres";
import NotFoundError from "../../errors/NotFoundError";
import JWT from "../../helpers/JWT";
import WebSocket from "../WebSocket";

export default async function privateMessage (socket: Socket) {
    socket.on('socket-message', async (data: {
        token: string;
        content: string;
        chat_id: string;
        receiver_id: string;
    }, func: Function) => {        
        try {
            if (!data) return;
            if (!data.token) return;
            if (!data.content) return;
            if (!data.content.trim()) return;
            if (data.content.length > 512) return;
            if (!data.chat_id) return;

            const member = await JWT.Validate(data.token);

            let response = null;
            await Postgres.query().begin(async transaction => {
                const qChat = (await transaction`
                    WITH matched_chat AS (
                        SELECT p1.chat_id
                        FROM participant p1
                        JOIN participant p2 ON p1.chat_id = p2.chat_id
                        JOIN chat c ON c.id = p1.chat_id
                        WHERE 
                            c.type = 'private'
                            AND c.id = ${data.chat_id}
                            AND p1.member_id = ${data.receiver_id}
                            AND p2.member_id = ${member.id}
                        LIMIT 1
                    )

                    SELECT
                        c.*,
                        json_agg(DISTINCT jsonb_build_object(
                            'id', p.id,
                            'member_id', p.member_id,
                            'joined_at', p.joined_at,
                            'role', p.role
                        )) AS participants
                    FROM chat c
                    JOIN matched_chat mc ON c.id = mc.chat_id
                    JOIN participant p ON p.chat_id = c.id
                    GROUP BY c.id;
                `)[0];

                if (!qChat) throw new NotFoundError('Chat not found.');

                const qMessage = (await transaction`
                    INSERT INTO 
                        message (
                            chat_id,
                            member_id,
                            content,
                            created_at
                        )
                        VALUES (
                            ${data.chat_id},
                            ${member.id},
                            ${data.content},
                            ${new Date()}
                        )
                    RETURNING
                        *;
                `)[0];

                response = qMessage;
            });
            
            const ms = WebSocket.members.get(data.receiver_id+'');
        
            if (ms) {
                for (const s of ms.entries()) {
                    WebSocket.io.to(s[0]).emit('socket-message', response);
                };
            };

            ResponseOk(func, response);
        } catch (error) {
            ResponseError(func, error);
        };
    }); 
};