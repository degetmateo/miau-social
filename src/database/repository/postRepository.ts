import DatabaseError from "../../errors/DatabaseError";
import GenericError from "../../errors/GenericError";
import NotFoundError from "../../errors/NotFoundError";
import UnauthorizedError from "../../errors/UnauthorizedError";
import Postgres from "../Postgres";
import Delete from "./post/Delete";
import Get from "./post/Get";
import GetById from "./post/GetById";
import GetComments from "./post/GetComments";
import GetFollowing from "./post/GetFollowing";
import GetThread from "./post/GetThread";
import ModeratorDelete from "./post/ModeratorDelete";
import Post from "./post/Post";

const get = async (data: {
    member: any;
    offset: number;
    id_member: number;
    username: string;
    replies: boolean;
    shared: boolean;
}) => {
    try {
        return await Get(data);
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }; 
    };
};

const getFollowing = async (data: {
    member: any;
    offset: number;
}) => {
    try {
        return await GetFollowing(data);
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }; 
    };
};

const getById = async (data: {
    member: any;
    id: number;
}) => {
    try {
        return await GetById(data);
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        };
    };
};

const getComments = async (data: {
    member: any;
    id: number;
    offset: number;
}) => {
    try {
        return await GetComments(data);
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        };
    };
};

const getThread = async (data: {
    member: any;
    id: number;
    offset: number;
}) => {
    try {
        return await GetThread(data);
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        };
    };
};

const post = async (data: {
    id_member: number;
    content: string;
    images: any[];
    type: 'default' | 'reply' | 'quote';
    target_id: number;
    spotify: any;
}) => {
    try {
        return await Post(data);
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        };
    };
};

const remove = async (data: {
    id_member: number;
    id_post: number;
}) => {
    try {
        return await Delete(data);
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

const removeAdmin = async (data: {
    id_post: number;
}) => {
    try {
        return await ModeratorDelete(data);
    } catch (error) {
        if (error instanceof GenericError) throw error;
        else {
            console.error(error);
            throw new DatabaseError();
        }
    }
}

export const postRepository = {
    get,
    getFollowing,
    getById,
    getComments,
    getThread,
    post,
    remove,
    removeAdmin,
}