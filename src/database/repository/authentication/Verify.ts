import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import JWT from "../../../helpers/JWT";
import Postgres from "../../Postgres";

export default async function Verify (data: {
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
                    m.id_member AS id,
                    m.username_member AS username,
                    m.name_member AS name,
                    m.role_member AS role,
                    m.email AS email,
                    icon.url AS icon_url,
                    banner.url AS banner_url,
                    m.status AS status
                FROM
                    member m
                LEFT JOIN
                    image icon ON icon.member_id = m.id_member AND icon.type = 'icon'
                LEFT JOIN
                    image banner ON banner.member_id = m.id_member AND banner.type = 'banner'
                WHERE
                    m.id_member = ${data.id} AND
                    m.username_member = ${data.username} AND
                    m.email = ${data.email} AND
                    m.role_member = ${data.role} AND
                    m.status = 'pending'
            `)[0];

            if (!member) throw new UnauthorizedError('Ha ocurrido un error de autorización.');

            const q: any = (await transaction`
                UPDATE 
                    member
                SET
                    status = 'active'
                WHERE
                    id_member = ${data.id} AND
                    username_member = ${data.username} AND
                    email = ${data.email} AND
                    role_member = ${data.role} AND
                    status = 'pending'
                RETURNING
                    id_member AS id,
                    username_member AS username,
                    name_member AS name,
                    role_member AS role,
                    email as email;
            `)[0];

            if (!q) throw new UnauthorizedError('Ha ocurrido un error de autorización.');

            const TOKEN = await JWT.Generate({
                id: member.id,
                username: member.username,
                role: member.role,
                email: member.email
            }, '30d');

            response = member;
            response.token = TOKEN;
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