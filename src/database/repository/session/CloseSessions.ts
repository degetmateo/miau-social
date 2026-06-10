import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import Postgres from "../../Postgres";

export default async function CloseSessions (data: {
    member: any;
    token: string;
}) {
    try {
        return await Postgres.query()`
            DELETE FROM
                session
            WHERE
                oomfy_id = ${data.member.id} AND
                token != ${data.token};
        `;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
};