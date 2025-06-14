import AlreadyUsedError from "../../../errors/AlreadyUsedError";
import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import JWT from "../../../helpers/JWT";
import Postgres from "../../Postgres";

export default async function UpdateUsername (data: {
    member: any;
    token: string;
    username: string;
}) {
    try {
        let response: any;
        await Postgres.query().begin(async transaction => {
            const usernameIsUsed = (await transaction`
                SELECT 
                    id_member
                FROM
                    member
                WHERE
                    username_member = ${data.username};
            `)[0];

            if (usernameIsUsed) throw new AlreadyUsedError("Ese nombre de usuario ya está en uso.");

            const member = (await transaction`
                UPDATE
                    member
                SET
                    username_member = ${data.username}
                WHERE
                    id_member = ${data.member.id}
                RETURNING
                    id_member AS id,
                    username_member AS username,
                    role_member AS role,
                    email AS email
            `)[0];

            if (!member) throw new DatabaseError();

            const REFRESH_TOKEN = await JWT.Generate({
                id: member.id,
                username: member.username,
                role: member.role,
                email: member.email
            }, "30d");

            const ACCESS_TOKEN = await JWT.Generate({
                id: member.id,
                name: member.name,
                username: member.username,
                icon_url: member.icon_url,
                role: member.role,
                email: member.email
            }, "15m");

            (await transaction`
                DELETE FROM
                    session
                WHERE 
                    member_id = ${member.id} AND
                    token != ${data.token}
            `);

            const session = (await transaction`
                UPDATE
                    session
                SET 
                    token = ${REFRESH_TOKEN}
                WHERE
                    member_id = ${member.id} AND
                    token = ${data.token}
                RETURNING
                    *;
            `)[0];

            if (!session) throw new UnauthorizedError();

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