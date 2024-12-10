import { Role } from "../database/models/Member";
import { postRepository } from "../database/repository/postRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";
import NotFoundError from "../errors/NotFoundError";
import UnauthorizedError from "../errors/UnauthorizedError";
import { PARAMETERS } from "../static/parameters";

const get = async (data: {
    member: {
        id: number;
        username: string;
        role: string;
    };
    offset: number;
    id_member: number | null;
    username: string | null;
}) => {
    if (data.offset === null || data.offset === undefined) throw new InvalidArgumentError("Offset is needed.");
    if (isNaN(data.offset)) throw new InvalidArgumentError("Offset must be a number.");
    if (data.offset < 0) throw new InvalidArgumentError("Offset cannot be negative.");

    if (data.id_member && isNaN(data.id_member)) throw new InvalidArgumentError("id_member must be a number.");
    if (data.id_member && data.id_member < 0) throw new InvalidArgumentError("id_member cannot be negative.");

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
    id_member: number;
    id_post: number;
}) => {
    if (!data.id_member) throw new UnauthorizedError("Authorization failed.");
    if (isNaN(data.id_member)) throw new UnauthorizedError("Authorization failed.");
    if (data.id_member <= 0) throw new UnauthorizedError("Authorization failed.");

    if (!data.id_post) throw new NotFoundError("No se ha encontrado la publicacion.");
    if (isNaN(data.id_post)) throw new InvalidArgumentError("La ID de la publicacion debe ser un numero.");
    if (data.id_post <= 0) throw new InvalidArgumentError("La ID de la publicacion no puede ser negativa.");

    const response = await postRepository.getById(data);
    return response;
}

const getComments = async (data: {
    id_member: number;
    id_post: number;
}) => {
    if (!data.id_member) throw new UnauthorizedError("Authorization failed.");
    if (isNaN(data.id_member)) throw new UnauthorizedError("Authorization failed.");
    if (data.id_member <= 0) throw new UnauthorizedError("Authorization failed.");

    if (!data.id_post) throw new NotFoundError("No se ha encontrado la publicacion.");
    if (isNaN(data.id_post)) throw new InvalidArgumentError("La ID de la publicacion debe ser un numero.");
    if (data.id_post <= 0) throw new InvalidArgumentError("La ID de la publicacion no puede ser negativa.");

    const response = await postRepository.getComments(data);
    return response;
}

const getThread = async (data: {
    id_member: number;
    id_post: number;
}) => {
    if (!data.id_member) throw new UnauthorizedError("Authorization failed.");
    if (isNaN(data.id_member)) throw new UnauthorizedError("Authorization failed.");
    if (data.id_member <= 0) throw new UnauthorizedError("Authorization failed.");

    if (!data.id_post) throw new NotFoundError("No se ha encontrado la publicacion.");
    if (isNaN(data.id_post)) throw new InvalidArgumentError("La ID de la publicacion debe ser un numero.");
    if (data.id_post <= 0) throw new InvalidArgumentError("La ID de la publicacion no puede ser negativa.");

    const response = await postRepository.getThread(data);
    return response;
}

const post = async (data: {
    id_member: number;
    content: string;
    images: string[];
    id_replied_post: number;
}) => {
    if (!data.content && !data.images) throw new InvalidArgumentError("Debes escribir algo o insertar una imagen.");

    if (data.content) {
        if (data.content.length <= 0) throw new InvalidArgumentError("Debes escribir algo.");
        if (data.content.length > PARAMETERS.POST_CONTENT_MAX_LENGTH) throw new InvalidArgumentError(`Has superado el límite de ${PARAMETERS.POST_CONTENT_MAX_LENGTH} carácteres.`);
    }

    if (data.images) {
        if (!Array.isArray(data.images)) throw new InvalidArgumentError("Ha ocurrido un error.");
        if (!data.content && data.images.length <= 0) throw new InvalidArgumentError("Debes escribir algo o insertar una imagen.");
        if (data.images.length > PARAMETERS.POST_IMAGES_MAX_LENGTH) throw new InvalidArgumentError(`Has superado el límite de ${PARAMETERS.POST_IMAGES_MAX_LENGTH} imágenes.`);
    }

    const response = await postRepository.post(data);
    return response;
}

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
    if (data.role_member != 'admin') throw new UnauthorizedError("No tienes permisos para realizar esta accion.");
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
    removeAdmin
}