import Postgres from "../../Postgres";

export default async function Unfollow (data: {
    id_member_follower: string;
    id_member_followed: string;
}) {
    await Postgres.query().begin(async transaction => {
        if (data.id_member_followed == data.id_member_follower) return;
        
        (await transaction`
            DELETE FROM
                follow
            WHERE
                oomfy_id_follower = ${data.id_member_follower} AND
                oomfy_id_followed = ${data.id_member_followed};
        `);
    });
};