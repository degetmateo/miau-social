import { auxRepository } from "../database/repository/auxRepository";

const get = async (data: {
    member: any;
    query: string;
    offset: number;
}) => {
    return await auxRepository.get(data);
};

export const auxService = {
    get
};