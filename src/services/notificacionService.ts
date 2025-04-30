import { notificationRepository } from "../database/repository/notificationRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";

const get = async (data: {
    id_member: number;
    offset: number;
}) => {
    if (isNaN(data.offset)) throw new InvalidArgumentError("Offset must be a number.");
    if (data.offset < 0) throw new InvalidArgumentError("Offset cannot be negative.");

    const response = await notificationRepository.Get(data);
    return response;
}

const read = async (data: {
    id_member: number;
}) => {
    const response = await notificationRepository.read(data);
    return response;
}

export const notificationService = {
    get,
    read
}