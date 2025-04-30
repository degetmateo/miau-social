import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import JWT from "../../../helpers/JWT";
import Postgres from "../../Postgres";

export default async function Authenticate (data: {
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

            const member = (await transaction`
                SELECT 
                    m.id_member as id,
                    m.name_member as name,
                    m.username_member as username,
                    m.role_member as role,
                    m.email as email,
                    icon.url as icon_url,
                    banner.url as banner_url
                FROM
                    member m
                LEFT JOIN
                    image icon ON icon.member_id = m.id_member AND icon.type = 'icon'
                LEFT JOIN
                    image banner ON banner.member_id = m.id_member AND banner.type = 'banner'
                WHERE
                    m.id_member = ${memberData.id} AND
                    m.username_member = ${memberData.username} AND
                    m.email = ${memberData.email};
            `)[0];

            if (!member) throw new UnauthorizedError("Ha ocurrido un error de autorización.");
 
            const REFRESH_TOKEN = await JWT.Generate({
                id: member.id,
                username: member.username,
                role: member.role,
                email: member.email
            }, "30d");

            const session = (await transaction`
                UPDATE 
                    session
                SET
                    token = ${REFRESH_TOKEN}
                WHERE
                    token = ${data.token} AND
                    member_id = ${member.id}
                RETURNING *;
            `)[0];

            if (!session) throw new UnauthorizedError("Expiró la sesión.", "EXPIRED_SESSION");

            const ACCESS_TOKEN = await JWT.Generate({
                id: member.id,
                username: member.username,
                role: member.role,
                email: member.email,
                session_id: session.id
            }, "15m");

            response = member;
            response.token = ACCESS_TOKEN;
            response.refresh_token = REFRESH_TOKEN;
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