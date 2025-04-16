import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import Mailer from "../../../helpers/Mailer";
import Postgres from "../../Postgres";

export default async function RecoverUsername (data: {
    email: string;
}) {
    try {
        await Postgres.query().begin(async transaction => {
            const member = (await transaction`
                SELECT
                    username_member as username,
                    email as email
                FROM
                    member
                WHERE
                    email = ${data.email};
            `)[0];
 
            if (!member) return;
            if (!member.email) return;

            try {
                await Mailer.Send({
                    to: member.email,
                    subject: 'Recuperá tu usuario',
                    html: `
                        <p>Tu usuario es: <b>${member.username}</b></p>
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