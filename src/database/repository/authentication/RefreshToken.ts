import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import JWT from "../../../helpers/JWT";
import Postgres from "../../Postgres";

export default async function RefreshToken (data: {
    token: string;
}) {
    try {
        let response: any;
        await Postgres.query().begin(async transaction => {
            let member: any;

            try {
                member = await JWT.Validate(data.token);
            } catch (error) {
                (await transaction`
                    DELETE FROM session WHERE token = ${data.token}; 
                `);
                throw new UnauthorizedError();
            };

            const session = (await transaction`
                SELECT
                    *
                FROM
                    session
                WHERE
                    member_id = ${member.id} AND
                    token = ${data.token};
            `)[0];

            if (!session) throw new UnauthorizedError("Expiró la sesión.", "EXPIRED_SESSION_rf");

            const ACCESS_TOKEN = await JWT.Generate({
                id: member.id,
                username: member.username,
                role: member.role,
                email: member.email
            }, "15m");

            response = ACCESS_TOKEN;
        });
        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
};