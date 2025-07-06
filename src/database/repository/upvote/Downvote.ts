import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import WebSocket from "../../../socket/WebSocket";
import Postgres from "../../Postgres";

export default async function Downvote (data: {
    id_member: number;
    id_post: number;
}) {
    try {
        let response = null;
        await Postgres.query().begin(async transaction => {
            const deleteUpvote = (await transaction`
                DELETE FROM
                    upvote
                WHERE
                    id_member_upvote = ${data.id_member} AND
                    id_post = ${data.id_post}
                RETURNING *;
            `)[0];

            if (!deleteUpvote) return;
            if (data.id_member == deleteUpvote.id_member_post) return;

            const deleted = (await transaction`
                DELETE FROM 
                    notification
                WHERE
                    id_member = ${deleteUpvote.id_member_post} AND
                    type_notification = 'upvote' AND
                    id_post_target_notification = ${deleteUpvote.id_post} AND
                    id_member_target_notification = ${deleteUpvote.id_member_upvote}
                RETURNING *;
            `)[0];

            if (!deleted) return;

            const ms = WebSocket.members.get(deleted.id_member);

            if (ms) {
                for (const s of ms.entries()) {
                    WebSocket.io.to(s[0]).emit('socket-notification-deleted', deleted);
                };
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