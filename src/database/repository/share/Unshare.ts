import Postgres from "../../Postgres";

export default async function Unshare (data: {
    member: any;
    id: number;
}) {
    await Postgres.query()`
        DELETE FROM
            post
        WHERE
            type = 'shared' AND
            id_member = ${data.member.id} AND
            target_post_id = ${data.id};
    `;
};