const uuid = require('uuid');

import { UUID } from "mongodb";
import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import IsPendingError from "../../../errors/IsPendingError";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import JWT from "../../../helpers/JWT";
import Password from "../../../helpers/Password";
import { mongo } from "../../mongo/mongodb";
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
                    m.email
                FROM
                    oomfy m
                WHERE
                    m.username = ${data.username};
            `)[0];

            if (!member) throw new UnauthorizedError("Algunos de los datos ingresados son incorrectos.");
            if (!await Password.compare(data.password, member.password)) throw new UnauthorizedError("Algunos de los datos ingresados son incorrectos.");
            if (member.status === 'pending') throw new IsPendingError("Tenés que activar tu cuenta.");

            delete member.password;
            delete member.status;

            const membersCollection = mongo.collection('members');
            const publicMember = await membersCollection.findOne({ _id: new UUID(member.id) as any });

            delete publicMember.icon.delete_url;
            delete publicMember.banner.delete_url;

            const REFRESH_TOKEN = await JWT.Generate({
                id: member.id,
                name: publicMember.name,
                username: member.username,
                role: publicMember.role,
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
                role: member.role,
                email: member.email
            }, "15m");

            response = publicMember;
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