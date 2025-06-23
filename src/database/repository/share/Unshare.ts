import WebSocket from "../../../socket/WebSocket";
import Postgres from "../../Postgres";

export default async function Unshare (data: {
    member: any;
    id: number;
}) {
    await Postgres.query().begin(async transaction => {
        const qDelete = (await transaction`
            DELETE FROM
                post
            WHERE
                type = 'shared' AND
                id_member = ${data.member.id} AND
                target_post_id = ${data.id}
            RETURNING
                id_member;
        `)[0];

        const deleted = (await transaction`
            DELETE FROM
                notification
            WHERE
                id_member = ${qDelete.id_member} AND
                id_post_target_notification = ${data.id} AND
                id_member_target_notification = ${data.member.id} AND
                type_notification = 'shared'
            RETURNING *;
        `)[0];

        const ms = WebSocket.members.get(deleted.id_member);

        if (!ms) return;
        for (const s of ms.entries()) {
            WebSocket.io.to(s[0]).emit('socket-notification-deleted', deleted);
        };
    });
};