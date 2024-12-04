import DatabaseError from "../../errors/DatabaseError";
import GenericError from "../../errors/GenericError";
import NotFoundError from "../../errors/NotFoundError";
import Postgres from "../Postgres";

const post = async (data: {
    id_member: number;
    id_post: number;
}) => {
    const response = await Postgres.query().begin(async transaction => {
        const qPost: Array<{
            id_member: number;
        }> = await transaction`
            SELECT 
                id_member
            FROM
                post
            WHERE
                id_post = ${data.id_post};
        `;

        if (!qPost[0]) throw new NotFoundError("No se ha encontrado la publicación.");

        await transaction`
            INSERT INTO upvote (
                id_member_upvote,
                id_member_post,
                id_post
            )
            VALUES (
                ${data.id_member},
                ${qPost[0].id_member},
                ${data.id_post}
            );
        `;
    });

    return response;
}   

const remove = async (data: {
    id_member: number;
    id_post: number;
}) => {
    try {
        const response = await Postgres.query()`
            DELETE FROM
                upvote
            WHERE
                id_member_upvote = ${data.id_member} AND
                id_post = ${data.id_post};
        `;

        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

export const upvoteRepository = {
    post,
    remove
}