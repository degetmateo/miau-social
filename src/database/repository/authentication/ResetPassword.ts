import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import InvalidArgumentError from "../../../errors/InvalidArgumentError";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import JWT from "../../../helpers/JWT";
import Mailer from "../../../helpers/Mailer";
import Password from "../../../helpers/Password";
import { FRONTEND_URL } from "../../../static/config";
import Postgres from "../../Postgres";

export default async function ResetPassword (data: {
    id: number;
    username: string;
    email: string;
    password: string;
}) {
    try {
        await Postgres.query().begin(async transaction => {
            data.password = await Password.hash(data.password);

            const member = (await transaction`
                UPDATE 
                    member
                SET
                    password_member = ${data.password}
                WHERE
                    id_member = ${data.id} AND
                    username_member = ${data.username} AND
                    email = ${data.email}
                RETURNING
                    *;
            `)[0];

            if (!member) throw new UnauthorizedError();
        });
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
};