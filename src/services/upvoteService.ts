import { upvoteRepository } from "../database/repository/upvoteRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";

const post = async (data: {
    id_member: number;
    id_post: number;
}) => {
    if (!data.id_post) throw new InvalidArgumentError("La ID del post es necesaria.");
    if (isNaN(data.id_post)) throw new InvalidArgumentError("La ID del post debe ser un numero.");
    if (data.id_post <= 0) throw new InvalidArgumentError("La ID del post debe ser positiva.");

    const response = await upvoteRepository.post(data);
    return response;
}

const remove = async (data: {
    id_member: number;
    id_post: number;
}) => {
    if (!data.id_post) throw new InvalidArgumentError("La ID del post es necesaria.");
    if (isNaN(data.id_post)) throw new InvalidArgumentError("La ID del post debe ser un numero.");
    if (data.id_post <= 0) throw new InvalidArgumentError("La ID del post debe ser positiva.");

    const response = await upvoteRepository.remove(data);
    return response;
}

export const upvoteService = {
    post,
    remove
}