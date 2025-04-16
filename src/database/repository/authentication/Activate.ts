import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import InvalidArgumentError from "../../../errors/InvalidArgumentError";
import NotFoundError from "../../../errors/NotFoundError";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import JWT from "../../../helpers/JWT";
import Mailer from "../../../helpers/Mailer";
import Password from "../../../helpers/Password";
import Postgres from "../../Postgres";

export default async function Activate (data: {
    username: string;
    email: string;
    password: string;
}) {
    try {
        await Postgres.query().begin(async transaction => {
            const member: any = (await transaction`
                SELECT
                    id_member AS id,
                    username_member AS username,
                    role_member AS role,
                    password_member AS password,
                    email AS email,
                    status AS status
                FROM
                    member
                WHERE
                    username_member = ${data.username};
            `)[0];

            if (!member) throw new NotFoundError('Algunos de tus datos son incorrectos.');
            if (member.status !== 'pending') throw new InvalidArgumentError("Ha ocurrido un error.");
            if (!await Password.compare(data.password, member.password)) throw new UnauthorizedError("Algunos de tus datos son incorrectos.");

            if (member.email) {
                if (member.email !== data.email) throw new UnauthorizedError("Algunos de tus datos son incorrectos.");
            } else {
                await transaction`
                    UPDATE 
                        member
                    SET
                        email = ${data.email}
                    WHERE
                        id_member = ${member.id} AND
                        username_member = ${member.username};
                `;

                member.email = data.email;
            }

            const TOKEN = await JWT.Generate({
                id: member.id,
                username: member.username,
                email: member.email,
                role: member.role
            }, '1h');

            const URL = process.env.FRONTEND_URL + '/verify?token=' + TOKEN;

            try {
                await Mailer.Send({
                    to: member.email,
                    subject: 'Activá tu cuenta de Social Miau',
                    html: `
                        <p>Para activar tu cuenta debes ir al siguiente enlace. Expira en 10 minutos. No se lo compartas a nadie.</p>
                        <p>Si no era tu intención recibir este correo, ignóralo.</p>
                        <br>
                        <a href="${URL}" target="_blank">${URL}</a>
                    `
                });
            } catch (error) {
                console.error(error);
            }
        });
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
};