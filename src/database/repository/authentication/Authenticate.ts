import { mongo } from "../../mongo/mongodb";
import DatabaseError from "../../../errors/DatabaseError";
import GenericError from "../../../errors/GenericError";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import JWT from "../../../helpers/JWT";
import Postgres from "../../Postgres";
import { UUID } from "mongodb";

export default async function Authenticate (data: {
    token: string;
}) {
    try {
        let response: any;
        await Postgres.query().begin(async transaction => {
            let memberData: {
                id: number;
                username: string;
                role: string;
                email: string;
            } = null;

            try {
                memberData = await JWT.Validate(data.token);
            } catch (error) {
                (await transaction`
                    DELETE FROM session WHERE token = ${data.token}; 
                `);
                throw new UnauthorizedError();
            };

            const member = (await transaction`
                SELECT
                    o.id,
                    o.name,
                    o.username,
                    o.role,
                    o.email,
                    s.id as session_id
                FROM
                    oomfy o
                LEFT JOIN
                    session s ON s.oomfy_id = o.id AND s.token = ${data.token}
                WHERE
                    o.id = ${memberData.id} AND
                    o.username = ${memberData.username} AND
                    o.email = ${memberData.email};
            `)[0];

            if (!member) throw new UnauthorizedError("Ha ocurrido un error de autorización.");
            if (!member.session_id) throw new UnauthorizedError("Expiró la sesión.", "EXPIRED_SESSION_au");

            const REFRESH_TOKEN = await JWT.Generate({
                id: member.id,
                username: member.username,
                role: member.role,
                email: member.email
            }, "30d");

            (await transaction`
                UPDATE 
                    session
                SET
                    token = ${REFRESH_TOKEN}
                WHERE
                    id = ${member.session_id};
            `);

            const membersCollection = mongo.collection('members');
            const publicMember = await membersCollection.findOne({ _id: new UUID(member.id) as any });

            const ACCESS_TOKEN = await JWT.Generate({
                id: member.id,
                name: member.name,
                username: member.username,
                icon_url: publicMember.icon.url,
                role: member.role,
                email: member.email
            }, "15m");

            delete publicMember.icon.delete_url;
            delete publicMember.banner.delete_url;

            response = publicMember;
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