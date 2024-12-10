import DatabaseError from "../../errors/DatabaseError";
import GenericError from "../../errors/GenericError"
import InvalidArgumentError from "../../errors/InvalidArgumentError";
import UnauthorizedError from "../../errors/UnauthorizedError";
import JWT from "../../helpers/JWT";
import Password from "../../helpers/Password";
import Postgres from "../Postgres";

const login = async (data: {
    username: string;
    password: string;
}) => {
    try {
        const response: any[] = await Postgres.query()`
            SELECT
                m.id_member AS id,
                m.username_member AS username,
                m.password_member AS password,
                m.name_member AS name,
                m.role_member AS role,
                icon.url AS icon_url
            FROM
                member m
            LEFT JOIN
                image icon ON icon.member_id = m.id_member AND icon.type = 'icon'
            WHERE
                m.username_member = ${data.username};
        `;

        if (!response[0]) throw new UnauthorizedError("Algunas de tus credenciales son incorrectas.");

        if (!await Password.compare(data.password, response[0].password)) throw new UnauthorizedError("Algunas de tus credenciales son incorrectas.");
        
        const TOKEN = await JWT.Generate({ 
            id: response[0].id, 
            username: response[0].username,
            role: response[0].role
        }, "24h");

        delete response[0].password;
        response[0].token = TOKEN;

        return response[0];
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            if (error instanceof GenericError) throw error;
            else {
                console.error(error);
                throw new DatabaseError();
            }
        }
    }
}

const signin = async (data: {
    username: string;
    password: string;
}) => {
    try {
        let response: any;
        await Postgres.query().begin(async transaction => {
            await transaction`
                SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
            `;

            const qMemberUsername = await transaction`
                SELECT * FROM member WHERE LOWER(username_member) = ${data.username.toLowerCase()};
            `;

            if (qMemberUsername[0]) throw new InvalidArgumentError("Nombre de usuario ya en uso.");

            await transaction`
                SELECT insert_member (
                    ${data.username},
                    ${data.password},
                    ${new Date().toISOString()}
                );
            `;

            const qRegisteredMember: any[] = await transaction`
                SELECT
                    m.id_member AS id,
                    m.username_member AS username,
                    m.password_member AS password,
                    m.name_member AS name,
                    m.role_member AS role,
                    icon.url AS icon_url
                FROM
                    member m
                LEFT JOIN
                    image icon ON icon.member_id = m.id_member AND icon.type = 'icon'
                WHERE
                    m.username_member = ${data.username};
            `;

            const TOKEN = await JWT.Generate({ 
                id: qRegisteredMember[0].id, 
                username: qRegisteredMember[0].username,
                role: qRegisteredMember[0].role
            }, "24h");

            delete qRegisteredMember[0].password;
            qRegisteredMember[0].token = TOKEN;
            response = qRegisteredMember[0];
        });
        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

const getMemberData = async (data: {
    id: number;
}) => {
    try {
        const response = await Postgres.query()`
            SELECT
                m.id_member AS id,
                m.username_member AS username,
                m.name_member AS name,
                m.role_member AS role,
                icon.url AS icon_url
            FROM
                member m
            LEFT JOIN
                image icon ON icon.member_id = m.id_member AND icon.type = 'icon'
            WHERE
                m.id_member = ${data.id};
        `;

        if (!response[0]) throw new UnauthorizedError("No se ha encontrado al usuario especificado.");
        return response[0];
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

export const authenticationRepository = {
    login,
    signin,
    getMemberData
}