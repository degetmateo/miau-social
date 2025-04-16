import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import InvalidArgumentError from "../../../errors/InvalidArgumentError";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import JWT from "../../../helpers/JWT";
import Mailer from "../../../helpers/Mailer";
import { FRONTEND_URL } from "../../../static/config";
import Postgres from "../../Postgres";

export default async function RecoverPassword (data: {
    username: string;
}) {
    try {
        let response: any;
        await Postgres.query().begin(async transaction => {
            const member = (await transaction`
                SELECT
                    id_member as id,
                    username_member as username,
                    role_member as role,
                    email as email
                FROM
                    member
                WHERE
                    username_member = ${data.username};
            `)[0];
 
            if (!member) throw new InvalidArgumentError();
            if (!member.email) throw new InvalidArgumentError();

            const TOKEN = await JWT.Generate({
                id: member.id,
                username: member.username,
                role: member.role,
                email: member.email
            }, '1h');

            const URL = FRONTEND_URL + '/recovery/reset-password?token=' + TOKEN;

            try {
                await Mailer.Send({
                    to: member.email,
                    subject: 'Recuperá tu contraseña',
                    html: `
                        <p>Andá al siguiente enlace para cambiar tu contraseña. Expira en 10 minutos. No se lo compartas a nadie.</p>
                        <br>
                        <a href="${URL}" target="_blank">${URL}</a>
                    `
                });
            } catch (error) {
                console.error(error);
            }
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