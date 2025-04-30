import DatabaseError from "../../errors/DatabaseError";
import GenericError from "../../errors/GenericError";
import Postgres from "../Postgres";
import Get from "./notification/Get";

const read = async (data: {
    id_member: number;
}) => {
    try {
        const response = await Postgres.query()`
            UPDATE
                notification
            SET
                status = 'seen'
            WHERE
                status = 'pending' AND
                id_member = ${data.id_member};
        `;

        return response;
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
        }
    }
}

export const notificationRepository = {
    Get,
    read
}