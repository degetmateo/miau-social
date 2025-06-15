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
                    s.id as session_id,
                    m.id_member as id,
                    m.name_member as name,
                    m.username_member as username,
                    m.role_member as role,
                    m.email as email,
                    icon.url as icon_url
                FROM
                    session s
                LEFT JOIN
                    member m ON m.id_member = s.member_id
                LEFT JOIN
                    image icon ON icon.type = 'icon' AND icon.member_id = m.id_member
                WHERE
                    s.member_id = ${member.id} AND
                    s.token = ${data.token};
            `)[0];

            if (!session || !session.session_id) throw new UnauthorizedError("Expiró la sesión.", "EXPIRED_SESSION_rf");

            const ACCESS_TOKEN = await JWT.Generate({
                id: session.id,
                name: session.name,
                username: session.username,
                icon_url: session.icon_url,
                role: session.role,
                email: session.email
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