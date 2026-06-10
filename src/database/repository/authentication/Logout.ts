import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import IsPendingError from "../../../errors/IsPendingError";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import JWT from "../../../helpers/JWT";
import Password from "../../../helpers/Password";
import Postgres from "../../Postgres";

export default async function Logout (data: {
    token: string;
}) {
    try {
        let response: any;
        await Postgres.query().begin(async transaction => {
            const member = await JWT.Validate(data.token);

            (await transaction`
                DELETE FROM
                    session
                WHERE
                    oomfy_id = ${member.id} AND
                    token = ${data.token};
            `);
        });
        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        };
    };
};