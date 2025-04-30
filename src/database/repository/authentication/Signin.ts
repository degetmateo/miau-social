import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import IsPendingError from "../../../errors/IsPendingError";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import JWT from "../../../helpers/JWT";
import Password from "../../../helpers/Password";
import Postgres from "../../Postgres";

export default async function Signin (data: {
    username: string;
    password: string;
    ip: string;
    platform: string;
}) {
    try {
        let response: any;
        await Postgres.query().begin(async transaction => {
            const member = (await transaction`
                SELECT
                    m.id_member AS id,
                    m.username_member AS username,
                    m.password_member AS password,
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
                    m.username_member = ${data.username};
            `)[0];

            if (!member) throw new UnauthorizedError("Algunos de los datos ingresados son incorrectos.");
            if (!await Password.compare(data.password, member.password)) throw new UnauthorizedError("Algunos de los datos ingresados son incorrectos.");
            if (member.status === 'pending') throw new IsPendingError("Tenés que activar tu cuenta.");

            delete member.password;
            delete member.status;

            const REFRESH_TOKEN = await JWT.Generate({
                id: member.id,
                username: member.username,
                role: member.role,
                email: member.email
            }, "30d");

            const session: any = (await transaction`
                INSERT INTO
                    session (
                        member_id,
                        date,
                        ip,
                        platform,
                        token
                    )
                    VALUES (
                        ${member.id},
                        ${new Date().toISOString()},
                        ${data.ip},
                        ${data.platform},
                        ${REFRESH_TOKEN}
                    )
                RETURNING *;
            `)[0];

            const ACCESS_TOKEN = await JWT.Generate({
                id: member.id,
                username: member.username,
                role: member.role,
                email: member.email,
                session_id: session.id
            }, "15m");

            response = member;
            response.token = ACCESS_TOKEN
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