import DatabaseError from "../../errors/DatabaseError";
import GenericError from "../../errors/GenericError";
import GetMembers from "./auxiliary/GetMembers";
import GetPosts from "./auxiliary/GetPosts";

const get = async (data: {
    member: any;
    query: string;
    filter: 'posts' | 'members';
    offset: number;
}) => {
    try {
        if (data.filter === 'members') return await GetMembers(data);
        return await GetPosts(data);
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