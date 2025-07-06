import InvalidArgumentError from "../../../errors/InvalidArgumentError";
import NotFoundError from "../../../errors/NotFoundError";
import WebSocket from "../../../socket/WebSocket";
import Postgres from "../../Postgres";
import { notificationRepository } from "../notificationRepository";

export default async function Share (data: {
    member: any;
    id: number;
}) {
    let IDNotification = null;
    await Postgres.query().begin(async transaction => {
        const qShared = (await transaction`
            SELECT 
                id_post
            FROM
                post
            WHERE
                type = 'shared' AND
                id_member = ${data.member.id} AND
                target_post_id = ${data.id};        
        `)[0];
        
        if (qShared) throw new InvalidArgumentError("Ya compartiste esta publicación.");

        const post = (await transaction`
            SELECT
                id_post,
                id_member
            FROM
                post
            WHERE
                id_post = ${data.id};
        `)[0];

        if (!post) throw new NotFoundError("No existe esa publicación.");

        const INSERT = (await transaction`
            INSERT INTO
                post (id_member, content_post, date_post, type, target_post_id)
            VALUES (
                ${data.member.id},
                NULL,
                ${new Date().toISOString()},
                'shared',
                ${data.id}
            )
            RETURNING 
                id_post;
        `)[0];

        if (data.member.id == post.id_member) return;

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
                    'shared',
                    ${data.id},
                    ${data.member.id}
                )
                RETURNING *;
        `)[0];

        IDNotification = qn.id_notification;
    });

    if (IDNotification) {
        const notification = await notificationRepository.GetByID({
            id: IDNotification
        });
    
        const ms = WebSocket.members.get(notification.id_member);
    
        if (ms) {
            for (const s of ms.entries()) {
                WebSocket.io.to(s[0]).emit('socket-notification', notification);
            };
        };
    };
};