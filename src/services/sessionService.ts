import { sessionRepository } from "../database/repository/sessionRepository";
import UnauthorizedError from "../errors/UnauthorizedError";

const get = async (data: {
    member: any;
    token: string;
}) => {
    if (!data.token) throw new UnauthorizedError();
    return await sessionRepository.Get(data);
};

const close = async (data: {
    member: any;
    token: string;
}) => {
    if (!data.token) throw new UnauthorizedError("No estás autorizado.");
    return await sessionRepository.CloseSessions(data);
};

export const sessionService = {
    get,
    close
};