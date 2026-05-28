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
                throw new UnauthorizedError();
            };

            const member = (await transaction`
                SELECT
                    o.id,
                    o.name,
                    o.username,
                    o.role,
                    o.email
                    i.url as icon_url,
                    b.url as banner_url
                FROM
                    oomfy o
                LEFT JOIN
                    icon i ON i.id = o.id
                LEFT JOIN
                    banner b ON b.id = o.id
                WHERE
                    o.id = ${memberData.id} AND
                    o.username = ${memberData.username} AND
                    o.email = ${memberData.email};
            `)[0];

            if (!member) throw new UnauthorizedError("Ha ocurrido un error de autorización.");
 
            const session = (await transaction`
                SELECT
                    id
                FROM
                    session
                WHERE
                    oomfy_id = ${member.id} AND
                    token = ${data.token};
            `)[0];

            if (!session) throw new UnauthorizedError("Expiró la sesión.", "EXPIRED_SESSION_au");

            const REFRESH_TOKEN = await JWT.Generate({
                id: member.id,
                username: member.username,
                role: member.role,
                email: member.email
            }, "30d");

            (await transaction`
                UPDATE 
                    session
                SET
                    token = ${REFRESH_TOKEN}
                WHERE
                    id = ${session.id};
            `);

            const ACCESS_TOKEN = await JWT.Generate({
                id: member.id,
                name: member.name,
                username: member.username,
                icon_url: member.icon_url,
                role: member.role,
                email: member.email
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
        };
    };
};