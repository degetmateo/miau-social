import { Role } from "../database/models/Member";
import { postRepository } from "../database/repository/postRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";
import NotFoundError from "../errors/NotFoundError";
import UnauthorizedError from "../errors/UnauthorizedError";
import Post from "./post/Post";

const get = async (data: {
    member: any;
    offset: number;
    id_member: number;
    username: string;
    replies: boolean;
    shared: boolean;
}) => {
    if (data.offset === null || data.offset === undefined) throw new InvalidArgumentError("Offset is needed.");
    if (isNaN(data.offset)) throw new InvalidArgumentError("Offset must be a number.");
    if (data.offset < 0) throw new InvalidArgumentError("Offset cannot be negative.");

    if (data.id_member && isNaN(data.id_member)) throw new InvalidArgumentError("id_member must be a number.");
    if (data.id_member && data.id_member < 0) throw new InvalidArgumentError("id_member cannot be negative.");

    if (data.replies != null && typeof data.replies != 'boolean') throw new InvalidArgumentError("replies is boolean.");
    if (data.shared != null && typeof data.shared != 'boolean') throw new InvalidArgumentError("shared is boolean.");

    return await postRepository.get(data);
}

const getFollowing = async (data: {
    member: {
        id: number;
        username: string;
        role: string;
    };
    offset: number;
}) => {
    if (data.offset === null || data.offset === undefined) throw new InvalidArgumentError("Offset is needed.");
    if (isNaN(data.offset)) throw new InvalidArgumentError("Offset must be a number.");
    if (data.offset < 0) throw new InvalidArgumentError("Offset cannot be negative.");

    return await postRepository.getFollowing(data);
}

const getById = async (data: {
    member: any;
    id: number;
}) => {
    if (!data.id) throw new NotFoundError("No se ha encontrado la publicacion.");
    if (isNaN(data.id)) throw new InvalidArgumentError("La ID de la publicacion debe ser un numero.");
    if (data.id <= 0) throw new InvalidArgumentError("La ID de la publicacion no puede ser negativa.");

    return await postRepository.getById(data);
};

const getComments = async (data: {
    member: any;
    id: number;
    offset: number;
}) => {
    if (!data.id) throw new NotFoundError("No se ha encontrado la publicacion.");
    if (isNaN(data.id)) throw new InvalidArgumentError("La ID de la publicacion debe ser un numero.");
    if (data.id <= 0) throw new InvalidArgumentError("La ID de la publicacion no puede ser negativa.");

    if (data.offset && data.offset < 0) throw new InvalidArgumentError('OFFSET no puede ser negativo.');

    return await postRepository.getComments(data);
};

const getThread = async (data: {
    member: any;
    id: number;
    offset: number;
}) => {
    if (!data.id) throw new NotFoundError("No se ha encontrado la publicacion.");
    if (isNaN(data.id)) throw new InvalidArgumentError("La ID de la publicacion debe ser un numero.");
    if (data.id <= 0) throw new InvalidArgumentError("La ID de la publicacion no puede ser negativa.");

    if (data.offset && data.offset < 0) throw new InvalidArgumentError('OFFSET no puede ser negativo.');

    const response = await postRepository.getThread(data);
    return response;
}

const post = async (data: {
    id_member: number;
    content: string;
    tenor: { src: string; index: number }[];
    images: { buffer: Express.Multer.File['buffer'], index: number }[];
    type: 'default' | 'reply' | 'quote';
    target_id: number;
    spotify_url: string;
}) => {
    return await Post(data);
};

const remove = async (data: {
    id_member: number;
    id_post: number;
}) => { 
    if (!data.id_post) throw new InvalidArgumentError("La ID del post es necesaria.");
    if (isNaN(data.id_post)) throw new InvalidArgumentError("La ID debe ser un numero.");
    if (data.id_post <= 0) throw new InvalidArgumentError("La ID del post debe ser positiva.");

    const response = await postRepository.remove(data);
    return response;
}

const removeAdmin = async (data: {
    id_member: number;
    role_member: Role;
    id_post: number;
}) => {
    if (data.role_member != 'admin' && data.role_member != 'mod') throw new UnauthorizedError("No tienes permisos para realizar esta accion.");
    const response = await postRepository.removeAdmin(data);
    return response;
}

export const postService = {
    get,
    getFollowing,
    getById,
    getComments,
    getThread,
    post,
    remove,
    removeAdmin,
}