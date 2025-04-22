import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import JWT from "../../../helpers/JWT";
import Postgres from "../../Postgres";

export default async function Authenticate (data: {
    id: number;
    email: string;
    username: string;
    role: string;
}) {
    try {
        let response: any;
        await Postgres.query().begin(async transaction => {
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
                    m.id_member = ${data.id} AND
                    m.username_member = ${data.username} AND
                    m.email = ${data.email};
            `)[0];

            if (!member) throw new UnauthorizedError("Ha ocurrido un error de autorización.");

            const ACCESS_TOKEN = await JWT.Generate({
                id: member.id,
                username: member.username,
                role: member.role,
                email: member.email
            }, "15m");

            // const REFRESH_TOKEN = await JWT.Generate({
            //     id: member.id,
            //     username: member.username,
            //     role: member.role,
            //     email: member.email
            // }, "30d");

            // (await transaction`
            //     UPDATE 
            //         session
            //     SET
            //         token = ${REFRESH_TOKEN}
            //     WHERE
            //         token = ${data.refresh_token};
            // `);

            response = member;
            response.token = ACCESS_TOKEN;
            // response.refresh_token = REFRESH_TOKEN;
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