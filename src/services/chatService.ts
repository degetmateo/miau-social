import { chatRepository } from "../database/repository/chatRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";

const get = async (data: {
    member: any;
    offset: number;
}) => {
    return await chatRepository.get(data);
};

const post = async (data: {
    member: any;
    username: string;
}) => {
    if (!data.username) throw new InvalidArgumentError("Se necesita: nombre de usuario.");
    if (data.username === data.member.username) throw new InvalidArgumentError("¡No podés chatear con vos mismo!");
    return await chatRepository.post(data);
};

export const chatService = {
    post,
    get
};