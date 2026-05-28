const uuid = require('uuid');

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
                    m.id,
                    m.username,
                    m.password,
                    m.name,
                    m.role,
                    m.email,
                    i.url AS icon_url,
                    b.url AS banner_url,
                    m.status
                FROM
                    oomfy m
                LEFT JOIN
                    icon i ON i.id = m.id
                LEFT JOIN
                    banner b ON b.id = b.id
                WHERE
                    m.username = ${data.username};
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

            (await transaction`
                INSERT INTO
                    session (
                        id,
                        oomfy_id,
                        created_at,
                        ip,
                        platform,
                        token
                    )
                    VALUES (
                        ${uuid.v7()},
                        ${member.id},
                        ${new Date().toISOString()},
                        ${data.ip},
                        ${data.platform},
                        ${REFRESH_TOKEN}
                    )
                RETURNING *;
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