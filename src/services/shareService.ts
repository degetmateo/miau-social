import { shareRepository } from "../database/repository/shareRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";

const share = async (data: {
    member: any;
    id: number;
}) => {
    if (!data.id) throw new InvalidArgumentError("Se debe especificar la ID.");
    if (isNaN(data.id)) throw new InvalidArgumentError("La ID debe ser un número.");
    if (data.id < 0) throw new InvalidArgumentError("La ID no puede ser negativa.");

    return await shareRepository.share(data);
};

const unshare = async (data: {
    member: any;
    id: number;
}) => {
    if (!data.id) throw new InvalidArgumentError("Se debe especificar la ID.");
    if (isNaN(data.id)) throw new InvalidArgumentError("La ID debe ser un número.");
    if (data.id < 0) throw new InvalidArgumentError("La ID no puede ser negativa.");

    return await shareRepository.unshare(data);
};

export const shareService = {
    share,
    unshare
};