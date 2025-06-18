import { upvoteRepository } from "../database/repository/upvoteRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";

const upvote = async (data: {
    id_member: number;
    id_post: number;
}) => {
    if (!data.id_post) throw new InvalidArgumentError("La ID del post es necesaria.");
    if (isNaN(data.id_post)) throw new InvalidArgumentError("La ID del post debe ser un numero.");
    if (data.id_post <= 0) throw new InvalidArgumentError("La ID del post debe ser positiva.");

    const response = await upvoteRepository.Upvote(data);
    return response;
};

const downvote = async (data: {
    id_member: number;
    id_post: number;
}) => {
    if (!data.id_post) throw new InvalidArgumentError("La ID del post es necesaria.");
    if (isNaN(data.id_post)) throw new InvalidArgumentError("La ID del post debe ser un numero.");
    if (data.id_post <= 0) throw new InvalidArgumentError("La ID del post debe ser positiva.");

    const response = await upvoteRepository.Downvote(data);
    return response;
}

export const upvoteService = {
    upvote,
    downvote
}