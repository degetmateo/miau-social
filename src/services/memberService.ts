import { memberRepository } from "../database/repository/memberRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";
import NotFoundError from "../errors/NotFoundError";
import Password from "../helpers/Password";
import { PARAMETERS } from "../static/parameters";

const getByUsername = async (data: {
    id_logged_member: number;
    username: string;
}) => {
    if (!data.username) throw new InvalidArgumentError("Username not found.");
    const response = await memberRepository.getByUsername(data);
    return response;
}

const updateName = async (data: {
    id_member: number;
    name: string;
}) => {
    data.name = data.name + '';
    data.name = data.name.trim();
    
    if (!data.name) throw new InvalidArgumentError("Debes escribir tu nuevo nombre.");

    if (data.name.length > PARAMETERS.NAME_MAX_LENGTH) throw new InvalidArgumentError(`Tu nuevo nombre debe tener como máximo ${PARAMETERS.NAME_MAX_LENGTH} carácteres.`);
    if (data.name.length < PARAMETERS.NAME_MIN_LENGTH) throw new InvalidArgumentError(`Tu nuevo nombre debe tener como mínimo ${PARAMETERS.NAME_MIN_LENGTH} carácteres.`);

    const response = await memberRepository.updateName(data);
    return response;
}

const updateUsername = async (data: {
    id_member: number;
    username: string;
}) => {
    data.username = data.username + '';
    data.username = data.username.trim();
    
    if (!data.username) throw new InvalidArgumentError("Debes escribir tu nuevo nombre de usuario.");

    if (data.username.length > PARAMETERS.USERNAME_MAX_LENGTH) throw new InvalidArgumentError(`Tu nuevo nombre debe tener como máximo ${PARAMETERS.USERNAME_MAX_LENGTH} carácteres.`);
    if (data.username.length < PARAMETERS.USERNAME_MIN_LENGTH) throw new InvalidArgumentError(`Tu nuevo nombre debe tener como mínimo ${PARAMETERS.USERNAME_MIN_LENGTH} carácteres.`);

    const response = await memberRepository.updateUsername(data);
    return response;
}

const updateBio = async (data: {
    id_member: number;
    bio: string;
}) => {    
    if (!data.bio) throw new InvalidArgumentError("Debes escribir tu nueva biografia.");

    if (data.bio.length > PARAMETERS.BIO_MAX_LENGTH) throw new InvalidArgumentError(`Tu nueva biografia debe tener como máximo ${PARAMETERS.BIO_MAX_LENGTH} carácteres.`);

    const response = await memberRepository.updateBio(data);
    return response;
}

const updatePassword = async (data: {
    id_member: number;
    password: string;
    new_password: string;
}) => {
    if (!data.password) throw new InvalidArgumentError("Debes escribir tu clave anterior.")
    if (!data.new_password) throw new InvalidArgumentError("Debes escribir tu nueva clave.");

    if (data.password.length > PARAMETERS.PASSWORD_MAX_LENGTH) throw new InvalidArgumentError(`Tu nueva clave debe tener como máximo ${PARAMETERS.PASSWORD_MAX_LENGTH} carácteres.`);
    if (data.password.length < PARAMETERS.PASSWORD_MIN_LENGTH) throw new InvalidArgumentError(`Tu nueva clave debe tener como mínimo ${PARAMETERS.PASSWORD_MIN_LENGTH} carácteres.`);

    data.new_password = await Password.hash(data.new_password);

    const response = await memberRepository.updatePassword(data);
    return response;
}

const updateProfilePicture = async (data: {
    id_member: number;
    url: string;
}) => {    
    if (!data.url) throw new InvalidArgumentError("Debes ingresar el enlace hacia tu imagen.");

    const response = await memberRepository.updateProfilePicture(data);
    return response;
}

export const memberService = {
    getByUsername,
    updateName,
    updateUsername,
    updateBio,
    updatePassword,
    updateProfilePicture
}