import { auxRepository } from "../database/repository/auxRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";
import { PARAMETERS } from "../static/parameters";

const get = async (data: {
    member: any;
    query: string;
    offset: number;
}) => {
    if (!data.member || !data.query || typeof data.offset !== 'number') {
        throw new InvalidArgumentError("Argumentos de consulta inválidos.");
    };

    if (data.query.length > PARAMETERS.QUERY_MAX_LENGTH) {
        throw new InvalidArgumentError(`La consulta no puede exceder los ${PARAMETERS.QUERY_MAX_LENGTH} carácteres.`);
    };
    
    return await auxRepository.get(data);
};

export const auxService = {
    get
};