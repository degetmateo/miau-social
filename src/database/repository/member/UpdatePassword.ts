import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import JWT from "../../../helpers/JWT";
import Mailer from "../../../helpers/Mailer";
import Password from "../../../helpers/Password";
import Postgres from "../../Postgres";

export default async function UpdatePassword (data: {
    member: any;
    token: string;
    password: string;
    new_password: string;
}) {
    try {
        let response: any;
        await Postgres.query().begin(async transaction => {
            await JWT.Validate(data.token);

            const member = (await transaction`
                SELECT
                    id_member as id,
                    username_member as username,
                    role_member as role,
                    email as email,
                    password_member AS password
                FROM
                    member
                WHERE
                    id_member = ${data.member.id} AND
                    username_member = ${data.member.username} AND
                    email = ${data.member.email};
            `)[0];

            if (!member) throw new UnauthorizedError();
            if (!await Password.compare(data.password, member.password)) throw new UnauthorizedError("Contraseña incorrecta.");

            (await transaction`
                UPDATE
                    member
                SET
                    password_member = ${data.new_password}
                WHERE
                    id_member = ${data.member.id} AND
                    username_member = ${data.member.username} AND
                    email = ${data.member.email};
            `);

            (await transaction`
                DELETE FROM
                    session
                WHERE
                    member_id = ${data.member.id} AND
                    token != ${data.token};
            `);

            const TOKEN = await JWT.Generate({
                id: member.id,
                username: member.username,
                role: member.role,
                email: member.email
            }, '1h');

            const URL = process.env.FRONTEND_URL + '/recovery/reset-password?token=' + TOKEN;

            await Mailer.Send({
                to: member.email,
                subject: 'Se cambió tu contraseña',
                html: `
                    <p>La contraseña de tu cuenta se cambió. Si no fuiste vos, andá al siguiente enlace.</p>
                    <br>
                    <a href="${URL}" target="_blank">${URL}</a>
                `
            });
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