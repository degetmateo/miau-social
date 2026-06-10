import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import Postgres from "../../Postgres";

export default async function Get (data: {
    member: any;
    token: string;
}) {
    try {
        return await Postgres.query()`
            SELECT
                s.created_at,
                s.ip,
                s.platform,
                s.token = ${data.token} AS actual
            FROM
                session s
            WHERE
                s.oomfy_id = ${data.member.id}
        `;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        };
    };
};