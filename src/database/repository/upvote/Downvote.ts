import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import Postgres from "../../Postgres";

export default async function Downvote (data: {
    id_member: number;
    id_post: number;
}) {
    try {
        let response = null;
        await Postgres.query().begin(async transaction => {
            (await transaction`
                DELETE FROM
                    upvote
                WHERE
                    id_member_upvote = ${data.id_member} AND
                    id_post = ${data.id_post};
            `);

            const post = (await transaction`
                SELECT 
                    id_member
                FROM
                    post
                WHERE
                    id_post = ${data.id_post};
            `)[0];

            if (data.id_member == post.id_member) return;

            (await transaction`
                DELETE FROM 
                    notification
                WHERE
                    id_member = ${post.id_member} AND
                    type_notification = 'upvote' AND
                    id_post_target_notification = ${data.id_post} AND
                    id_member_target_notification = ${data.id_member};
            `);
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