import DatabaseError from "../../../errors/DatabaseError";
import Postgres from "../../Postgres";

export default async function ModeratorDelete (data: {
    id_post: number;
}) {
    let response = null;
    await Postgres.query().begin(async transaction => {
        (await transaction`
            DELETE FROM 
                upvote
            WHERE
                id_post = ${data.id_post};
        `);

        (await transaction`
            DELETE FROM
                image
            WHERE
                post_id = ${data.id_post};
        `);

        (await transaction`
            DELETE FROM
                post
            WHERE
                target_post_id = ${data.id_post} AND
                type = 'shared';
        `);

        (await transaction`
            DELETE FROM
                notification
            WHERE
                id_post_target_notification = ${data.id_post};
        `);

        response = (await transaction`
            DELETE FROM
                post
            WHERE
                id_post = ${data.id_post}
            RETURNING *;
        `)[0];

        if (!response) throw new DatabaseError("Ha ocurrido un error inesperado.");
    });

    return response;
};