import { sessionRepository } from "../database/repository/sessionRepository";

const get = async (data: {
    member: any;
}) => {
    return await sessionRepository.Get(data);
};

export const sessionService = {
    get
};