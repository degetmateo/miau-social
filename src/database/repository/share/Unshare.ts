import Postgres from "../../Postgres";

export default async function Unshare (data: {
    member: any;
    id: number;
}) {
    await Postgres.query().begin(async transaction => {
        const qDelete = (await transaction`
            DELETE FROM
                post
            WHERE
                type = 'shared' AND
                id_member = ${data.member.id} AND
                target_post_id = ${data.id}
            RETURNING
                id_member;
        `)[0];

        (await transaction`
            DELETE FROM
                notification
            WHERE
                id_member = ${qDelete.id_member} AND
                id_post_target_notification = ${data.id} AND
                id_member_target_notification = ${data.member.id} AND
                type_notification = 'shared';
        `);
    });
};