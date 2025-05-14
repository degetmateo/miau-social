import DatabaseError from "../../errors/DatabaseError";
import GenericError from "../../errors/GenericError";
import Share from "./share/Share";
import Unshare from "./share/Unshare";

const share = async (data: {
    member: any;
    id: number;
}) => {
    try {
        return await Share(data);
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    };
};

const unshare = async (data: {
    member: any;
    id: number;
}) => {
    try {
        return await Unshare(data);
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    };
};

export const shareRepository = {
    share,
    unshare
};