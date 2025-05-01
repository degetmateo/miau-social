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
            let memberData: {
                id: number;
                username: string;
                role: string;
                email: string;
            } = null;

            try {
                memberData = await JWT.Validate(data.token);
            } catch (error) {
                (await transaction`
                    DELETE FROM session WHERE token = ${data.token}; 
                `);
                throw error;
            }

            const session: any = (await transaction`
                SELECT
                    *
                FROM
                    session
                WHERE
                    token = ${data.token} AND
                    member_id = ${memberData.id};
            `)[0];

            if (!session) throw new UnauthorizedError("Expiró la sesión.", "EXPIRED_SESSION");

            const ACCESS_TOKEN = await JWT.Generate({
                id: memberData.id,
                username: memberData.username,
                role: memberData.role,
                email: memberData.email
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