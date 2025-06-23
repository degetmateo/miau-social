import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import NotFoundError from "../../../errors/NotFoundError";
import WebSocket from "../../../socket/WebSocket";
import Postgres from "../../Postgres";
import { notificationRepository } from "../notificationRepository";

export default async function Upvote (data: {
    id_member: number;
    id_post: number;
}) {
    try {
        let response = null;
        await Postgres.query().begin(async transaction => {
            const post = (await transaction`
                SELECT 
                    id_member,
                    id_post
                FROM
                    post
                WHERE
                    id_post = ${data.id_post};
            `)[0];

            if (!post) throw new NotFoundError("No se ha encontrado la publicación.");

            (await transaction`
                INSERT INTO upvote (
                    id_member_upvote,
                    id_member_post,
                    id_post
                )
                VALUES (
                    ${data.id_member},
                    ${post.id_member},
                    ${data.id_post}
                );
            `);

            if (data.id_member == post.id_member) return;

            const qn = (await transaction`
                INSERT INTO 
                    notification (
                        id_member,
                        date_notification,
                        type_notification,
                        id_post_target_notification,
                        id_member_target_notification
                    )
                VALUES (
                    ${post.id_member},
                    NOW(),
                    'upvote',
                    ${post.id_post},
                    ${data.id_member}
                )
                RETURNING *;
            `)[0];

            const notification = await notificationRepository.TGetByID({
                id: qn.id_notification,
                transaction: transaction
            });

            const ms = WebSocket.members.get(qn.id_member);

            if (!ms) return;
            for (const s of ms.entries()) {
                WebSocket.io.to(s[0]).emit('socket-notification', notification);
            };
        });

        return response;  
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        };
    };
};