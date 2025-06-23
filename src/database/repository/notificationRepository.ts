import DatabaseError from "../../errors/DatabaseError";
import GenericError from "../../errors/GenericError";
import Postgres from "../Postgres";
import Get from "./notification/Get";
import TGetByID from "./notification/TGetByID";

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
            throw new DatabaseError();
        }
    }
}

export const notificationRepository = {
    Get,
    TGetByID,
    read
}