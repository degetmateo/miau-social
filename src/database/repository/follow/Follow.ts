import UnauthorizedError from "../../../errors/UnauthorizedError";
import Postgres from "../../Postgres";

export default async function Follow (data: {
    id_member_follower: string;
    id_member_followed: string;
}) {
    await Postgres.query().begin(async transaction => {
        if (data.id_member_followed == data.id_member_follower) throw new UnauthorizedError();

        (await transaction`
            INSERT INTO follow (oomfy_id_follower, oomfy_id_followed)
            VALUES (
                ${data.id_member_follower},
                ${data.id_member_followed}
            );
        `);
    });
};