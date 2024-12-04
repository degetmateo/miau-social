import postgres from "postgres";
import GenericError from "../../errors/GenericError";
import DatabaseError from "../../errors/DatabaseError";
import Postgres from "../Postgres";
import NotFoundError from "../../errors/NotFoundError";
import UnauthorizedError from "../../errors/UnauthorizedError";
import { Member } from "../models/Member";
import InvalidArgumentError from "../../errors/InvalidArgumentError";
import Password from "../../helpers/Password";

const getById = async (data: {
    transaction?: postgres.TransactionSql<{}>;
    id: number;
}) => {
    try {
        let response: any;

        const T = async (_transaction: postgres.TransactionSql<{}>) => {
            const qMember = await _transaction`
                SELECT 
                    id_member,
                    username_member,
                    name_member,
                    date_creation_member,
                    bio_member,
                    profile_pic_url_member,
                    role_member
                FROM
                    member
                WHERE
                    id_member = ${data.id};
            `;

            if (!qMember[0]) throw new NotFoundError("No se ha encontrado al miembro.");
            response = qMember[0];
        }

        data.transaction ?
            await T(data.transaction) :
            await Postgres.query().begin(async t => T(t));

        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

const getPrivateByUsername = async (data: {
    transaction?: postgres.TransactionSql<{}>;
    username: string;
}) => {
    try {
        let response: Member;

        const T = async (_transaction: postgres.TransactionSql<{}>) => {
            const qMember: Member[] = await _transaction`
                SELECT * FROM
                    member
                WHERE
                    username_member = ${data.username};
            `;

            if (!qMember[0]) throw new UnauthorizedError("Algunas de tus credenciales son incorrectas.");
            response = qMember[0];
        }

        data.transaction ?
            await T(data.transaction) :
            await Postgres.query().begin(async t => T(t));

        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

const getByUsername = async (data: {
    id_logged_member: number;
    username: string;
}) => {
    try {
        const response = await Postgres.query()`
            SELECT 
                m.id_member AS id,
                m.username_member AS username,
                m.name_member AS name,
                m.role_member AS role,
                m.bio_member AS bio,
                m.date_creation_member AS created_at,
                jsonb_build_object (
                    'url', m.profile_pic_url_member
                ) AS profile_pic,
                (SELECT COUNT(*) FROM 
                    follow f 
                WHERE
                    f.id_member_followed = m.id_member) AS followers_count,
                (SELECT COUNT(*) FROM 
                    follow f 
                WHERE
                    f.id_member_follower = m.id_member) AS followed_count,
                EXISTS (
                    SELECT 1 FROM
                        follow f
                    WHERE 
                        f.id_member_follower = ${data.id_logged_member} AND 
                        f.id_member_followed = m.id_member
                ) as is_followed
            FROM
                member m
            WHERE
                m.username_member = ${data.username};
        `;

        if (!response[0]) throw new NotFoundError("Member not found.");
        return response[0];
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

const updateName = async (data: {
    id_member: number;
    name: string;
}) => {
    try {
        const response = await Postgres.query()`
            UPDATE
                member
            SET
                name_member = ${data.name}
            WHERE
                id_member = ${data.id_member};
        `;

        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

const updateUsername = async (data: {
    id_member: number;
    username: string;
}) => {
    try {
        const response = await Postgres.query().begin(async transaction => {
            await transaction`
                SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
            `;

            const qUsername = await transaction`
                SELECT * FROM
                    member
                WHERE
                    id_member != ${data.id_member} AND
                    username_member = ${data.username};
            `;

            if (qUsername[0]) throw new InvalidArgumentError("Ese nombre de usuario ya está en uso.");

            await transaction`
                UPDATE
                    member
                SET
                    username_member = ${data.username}
                WHERE
                    id_member = ${data.id_member};
            `;
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

const updateBio = async (data: {
    id_member: number;
    bio: string;
}) => {
    try {
        const response = await Postgres.query()`
            UPDATE
                member
            SET
                bio_member = ${data.bio}
            WHERE   
                id_member = ${data.id_member};
        `;

        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

const updatePassword = async (data: {
    id_member: number;
    password: string;
    new_password: string;
}) => {
    try {
        const response = await Postgres.query().begin(async transaction => {
            const qPassword: Array<{
                password_member: string;
            }> = await transaction`
                SELECT 
                    password_member 
                FROM
                    member
                WHERE
                    id_member = ${data.id_member};
            `;

            if (!qPassword[0]) throw new NotFoundError("No se ha encontrado al usuario.");

            if (!await Password.compare(data.password, qPassword[0].password_member)) throw new UnauthorizedError("Tu clave anterior es incorrecta.");

            await transaction`
                UPDATE
                    member
                SET
                    password_member = ${data.new_password}
                WHERE   
                    id_member = ${data.id_member};
            `;
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

const updateProfilePicture = async (data: {
    id_member: number;
    url: string;
}) => {
    try {
        const response = await Postgres.query()`
            UPDATE
                member
            SET
                profile_pic_url_member = ${data.url}
            WHERE   
                id_member = ${data.id_member};
        `;

        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

export const memberRepository = {
    getById,
    getPrivateByUsername,
    getByUsername,
    updateName,
    updateUsername,
    updateBio,
    updatePassword,
    updateProfilePicture
}