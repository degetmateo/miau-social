import Postgres from "../../Postgres";

export default async function Unfollow (data: {
    id_member_follower: number;
    id_member_followed: number;
}) {
    await Postgres.query().begin(async transaction => {
        if (data.id_member_followed == data.id_member_follower) return;
        
        (await transaction`
            DELETE FROM
                follow
            WHERE
                id_member_follower = ${data.id_member_follower} AND
                id_member_followed = ${data.id_member_followed};
        `);

        (await transaction`
            DELETE FROM
                notification
            WHERE
                type_notification = 'follow' AND
                id_member = ${data.id_member_followed} AND
                id_member_target_notification = ${data.id_member_follower};
        `);
    });
};