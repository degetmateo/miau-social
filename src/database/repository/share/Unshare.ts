import WebSocket from "../../../socket/WebSocket";
import Postgres from "../../Postgres";

export default async function Unshare (data: {
    member: any;
    id: number;
}) {
    let deleted = null;
    await Postgres.query().begin(async transaction => {
        const qDelete = (await transaction`
            DELETE FROM
                post
            WHERE
                type = 'shared' AND
                id_member = ${data.member.id} AND
                target_post_id = ${data.id}
            RETURNING
                id_member,
                target_post_id;
        `)[0];

        deleted = (await transaction`
            DELETE FROM
                notification
            WHERE
                type_notification = 'shared' AND
                id_member_target_notification = ${data.member.id} AND
                id_post_target_notification = ${qDelete.target_post_id}
            RETURNING
                id_member;
        `)[0];
    });

    if (deleted) {
        const ms = WebSocket.members.get(deleted.id_member);
    
        if (ms){
            for (const s of ms.entries()) {
                WebSocket.io.to(s[0]).emit('socket-notification-deleted', deleted);
            };
        };
    };
};