import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import Postgres from "../../Postgres";

export default async function Get (data: {
    member: any;
}) {
    try {
        return await Postgres.query()`
            SELECT
                date,
                ip,
                platform
            FROM
                session
            WHERE
                member_id = ${data.member.id}
        `;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        };
    };
};