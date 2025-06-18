import UnauthorizedError from "../../../errors/UnauthorizedError";
import Postgres from "../../Postgres";

export default async function Follow (data: {
    id_member_follower: number;
    id_member_followed: number;
}) {
    await Postgres.query().begin(async transaction => {
        if (data.id_member_followed == data.id_member_follower) throw new UnauthorizedError();

        (await transaction`
            INSERT INTO
                follow
            VALUES (
                ${data.id_member_follower},
                ${data.id_member_followed}
            );
        `);

        (await transaction`
            INSERT INTO
                notification (
                    id_member,
                    date_notification,
                    type_notification,
                    id_member_target_notification
                )
                VALUES (
                    ${data.id_member_followed},
                    NOW(),
                    'follow',
                    ${data.id_member_follower}
                );
        `);
    });
};