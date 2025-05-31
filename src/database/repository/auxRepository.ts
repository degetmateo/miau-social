import DatabaseError from "../../errors/DatabaseError";
import GenericError from "../../errors/GenericError";
import Get from "./auxiliary/Get";

const get = async (data: {
    member: any;
    query: string;
    offset: number;
}) => {
    try {
        return await Get(data);
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    };
};

export const auxRepository = {
    get
};