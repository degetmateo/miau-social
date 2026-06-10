const uuid = require('uuid');

import AlreadyUsedError from "../../../errors/AlreadyUsedError";
import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import JWT from "../../../helpers/JWT";
import Mailer from "../../../helpers/Mailer";
import Password from "../../../helpers/Password";
import Postgres from "../../Postgres";

export default async function Signup (data: {
    email: string;
    username: string;
    name: string;
    password: string;
}) {
    try {
        await Postgres.query().begin(async transaction => {
            await transaction`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;

            const q = await transaction`
                SELECT
                    email,
                    username
                FROM
                    oomfy
                WHERE
                    email = ${data.email} OR
                    LOWER(username) = LOWER(${data.username});
            `;

            if (q.length > 0) {
                for (let i = 0; i < q.length; i++) {
                    if (q[i].email === data.email) throw new AlreadyUsedError('Ya existe una cuenta con ese correo electrónico.');
                    if (q[i].username.toLowerCase() === data.username.toLowerCase()) throw new AlreadyUsedError('Ya existe una cuenta con ese nombre de usuario.');
                }
            }

            data.password = await Password.hash(data.password);

            const oomfyId = uuid.v7();

            const member = (await transaction`
                INSERT INTO oomfy (
                    id,
                    username,
                    name,
                    password,
                    created_at,
                    role,
                    status,
                    email
                )
                VALUES (
                    ${oomfyId},
                    ${data.username},
                    ${data.name},
                    ${data.password},
                    ${new Date().toISOString()},
                    'member',
                    'pending',
                    ${data.email}
                )
                RETURNING *;
            `)[0];

            (await transaction`
                INSERT INTO icon (id, oomfy_id) VALUES (${oomfyId}, ${oomfyId});
            `);

            (await transaction`
                INSERT INTO banner (id, oomfy_id) VALUES (${oomfyId}, ${oomfyId});
            `);

            const TOKEN = await JWT.Generate({
                id: member.id,
                username: data.username,
                email: data.email,
                role: 'member'
            }, '1h');

            const URL = process.env.FRONTEND_URL + '/verify?token=' + TOKEN;

            try {
                await Mailer.Send({
                    to: data.email,
                    subject: 'Activá tu cuenta de oomfy',
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