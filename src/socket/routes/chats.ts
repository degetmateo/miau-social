import { Socket } from "socket.io";
import JWT from "../../helpers/JWT";
import { ResponseError, ResponseOk } from "../ControllerResponse";
import Postgres from "../../database/Postgres";
import GenericError from "../../errors/GenericError";
import DatabaseError from "../../errors/DatabaseError";

async function get (socket: Socket) {
    socket.on('socket-chats', async (data: any, func: Function) => {
        try {
            const member = await JWT.Validate(data.token);
            const response = await Postgres.query()`
                SELECT
                    c.id as id,
                    c.date as date,
                    COALESCE(
                        (
                            SELECT jsonb_agg(jsonb_build_object(
                                'id', m.id_member,
                                'username', m.username_member,
                                'name', m.name_member,
                                'role', m.role_member
                            ))
                            FROM 
                                participant pm
                            LEFT JOIN
                                member m ON m.id_member = pm.member_id
                            WHERE 
                                pm.chat_id = c.id AND
                                pm.member_id != p.member_id
                        ), '[]'::jsonb
                    ) AS members
                FROM
                    participant p
                LEFT JOIN
                    chat c ON c.id = p.chat_id
                WHERE
                    p.member_id = ${member.id};
            `;

            ResponseOk(func, {
                chats: response
            });
        } catch (error) {
            if (error instanceof GenericError) return ResponseError(func, error);
            else {
                console.error(error);
                ResponseError(func, new DatabaseError());
            };
        };
    });
};

export default async function ChatsRouter (socket: Socket) {
    get(socket);
};