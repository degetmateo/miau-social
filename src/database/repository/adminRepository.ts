import DatabaseError from "../../errors/DatabaseError";
import GenericError from "../../errors/GenericError";
import Postgres from "../Postgres";

const updatePassword = async (data: {
    username: string;
    password: string;
}) => {
    try {
        const response = await Postgres.query()`
            UPDATE
                member
            SET
                password_member = ${data.password}
            WHERE
                username_member = ${data.username};
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

export const adminRepository = {
    updatePassword
}