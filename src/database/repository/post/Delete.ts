import UnauthorizedError from "../../../errors/UnauthorizedError";
import Postgres from "../../Postgres";

export default async function Delete (data: {
    id_member: number;
    id_post: number;
}) {
    let response = null;
    await Postgres.query().begin(async transaction => {
        await transaction`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;
        
        await transaction`
            DELETE FROM 
                upvote
            WHERE
                id_post = ${data.id_post};
        `;

        await transaction`
            DELETE FROM 
                image
            WHERE
                post_id = ${data.id_post}
            RETURNING *;
        `;

        await transaction`
            DELETE FROM
                post
            WHERE
                target_post_id = ${data.id_post} AND
                type = 'shared';
        `;

        (await transaction`
            DELETE FROM
                embed
            WHERE
                post_id = ${data.id_post};
        `);

        (await transaction`
            DELETE FROM
                notification
            WHERE
                id_post_target_notification = ${data.id_post};
        `);

        const qDelete = (await transaction`
            DELETE FROM
                post
            WHERE
                id_post = ${data.id_post} AND
                id_member = ${data.id_member}
            RETURNING *;
        `)[0];

        if (!qDelete) throw new UnauthorizedError("Error de autentificación.");
    });
    return response;
};