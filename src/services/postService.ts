import { Role } from "../database/models/Member";
import { postRepository } from "../database/repository/postRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";
import NotFoundError from "../errors/NotFoundError";
import UnauthorizedError from "../errors/UnauthorizedError";
import ImgBB from "../helpers/ImgBB";
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
    offset: number;
}) => {
    if (!data.id_member) throw new UnauthorizedError("Authorization failed.");
    if (isNaN(data.id_member)) throw new UnauthorizedError("Authorization failed.");
    if (data.id_member <= 0) throw new UnauthorizedError("Authorization failed.");

    if (!data.id_post) throw new NotFoundError("No se ha encontrado la publicacion.");
    if (isNaN(data.id_post)) throw new InvalidArgumentError("La ID de la publicacion debe ser un numero.");
    if (data.id_post <= 0) throw new InvalidArgumentError("La ID de la publicacion no puede ser negativa.");

    if (data.offset && data.offset < 0) throw new InvalidArgumentError('OFFSET no puede ser negativo.');

    const response = await postRepository.getComments(data);
    return response;
}

const getThread = async (data: {
    id_member: number;
    id_post: number;
    offset: number;
}) => {
    if (!data.id_member) throw new UnauthorizedError("Authorization failed.");
    if (isNaN(data.id_member)) throw new UnauthorizedError("Authorization failed.");
    if (data.id_member <= 0) throw new UnauthorizedError("Authorization failed.");

    if (!data.id_post) throw new NotFoundError("No se ha encontrado la publicacion.");
    if (isNaN(data.id_post)) throw new InvalidArgumentError("La ID de la publicacion debe ser un numero.");
    if (data.id_post <= 0) throw new InvalidArgumentError("La ID de la publicacion no puede ser negativa.");

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
}) => {
    const isEmpty = (!data.content || data.content.length <= 0) && [...data.tenor, ...data.images].length <= 0;
    if (isEmpty) throw new InvalidArgumentError("No puedes enviar una publicación vacia.");

    if (data.content && data.content.length > 0) {
        if (data.content.length > PARAMETERS.POST_CONTENT_MAX_LENGTH) throw new InvalidArgumentError(`Has superado el límite de ${PARAMETERS.POST_CONTENT_MAX_LENGTH} carácteres.`);
    }

    if (data.images || data.tenor || data.images.length > 0 || data.tenor.length > 0) {
        // if (!Array.isArray(data.images)) throw new InvalidArgumentError("Ha ocurrido un error.");
        // if (!data.content && data.images.length <= 0) throw new InvalidArgumentError("Debes escribir algo o insertar una imagen.");
        if ([...data.tenor, ...data.images].length > PARAMETERS.POST_IMAGES_MAX_LENGTH) throw new InvalidArgumentError(`Has superado el límite de ${PARAMETERS.POST_IMAGES_MAX_LENGTH} imágenes.`);
    }

    if (!['default', 'reply', 'quote'].includes(data.type)) throw new InvalidArgumentError('Tipo de publicación inválida.');
    if (data.target_id && data.target_id < 0) throw new InvalidArgumentError('TARGET_ID no puede ser negativa.');

    let checkedImages: {
        url: string;
        imgbb_id?: string;
        delete_url?: string;
        source: 'imgbb' | 'tenor' | 'other';
        index: number;
    }[] = [];

    for (const image of data.images) {
        const apiResponse = await ImgBB.upload({ buffer: image.buffer });

        checkedImages.push({
            url: apiResponse.data.url,
            imgbb_id: apiResponse.data.id,
            delete_url: apiResponse.data.delete_url,
            source: 'imgbb',
            index: image.index
        });
    }

    for (const gif of data.tenor) {
        checkedImages.push({
            url: gif.src,
            source: 'tenor',
            index: gif.index
        });
    }

    checkedImages = checkedImages.sort((a, b) => a.index - b.index);

    const response = await postRepository.post({
        id_member: data.id_member,
        content: data.content,
        images: checkedImages,
        type: data.type,
        target_id: data.target_id
    });

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