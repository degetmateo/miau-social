import InvalidArgumentError from "../../../errors/InvalidArgumentError";
import NotFoundError from "../../../errors/NotFoundError";
import Postgres from "../../Postgres";

export default async function Share (data: {
    member: any;
    id: number;
}) {
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
        
        if (qShared) throw new InvalidArgumentError("Ya has compartido esta publicación.");

        const qExists = (await transaction`
            SELECT
                id_post
            FROM
                post
            WHERE
                id_post = ${data.id};
        `)[0];

        if (!qExists) throw new NotFoundError("No existe tal publicación.");

        const INSERT: Array<{ id_post: number }> = await transaction`
            INSERT INTO
                post (id_member, content_post, date_post, type, target_post_id)
            VALUES (
                ${data.member.id},
                NULL,
                ${new Date().toISOString()},
                'shared',
                ${data.id}
            )
            RETURNING id_post;
        `;
    });
};