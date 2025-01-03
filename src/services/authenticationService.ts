import { authenticationRepository } from "../database/repository/authenticationRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";
import UnauthorizedError from "../errors/UnauthorizedError";
import JWT from "../helpers/JWT";
import Password from "../helpers/Password";
import { PARAMETERS } from "../static/parameters";
import { REGEX } from "../static/regex";

const login = async (data: {
    username: string;
    password: string;
}) => {
    if (!data.username) throw new InvalidArgumentError("Debes ingresar tu nombre de usuario.");
    if (!data.password) throw new InvalidArgumentError("Debes ingresar tu contraseña.");
    
    const response = await authenticationRepository.login(data);
    return response;
}

const signin = async (data: {
    username: string;
    password: string;
}) => {
    if (!data.username) throw new InvalidArgumentError("Debes ingresar un nombre de usuario.");
    if (!data.password) throw new InvalidArgumentError("Debes ingresar una clave.");

    if (data.username.length < PARAMETERS.USERNAME_MIN_LENGTH) throw new InvalidArgumentError(`Tu nombre de usuario debe tener un mínimo de ${PARAMETERS.USERNAME_MIN_LENGTH} carácteres.`);
    if (data.password.length < PARAMETERS.PASSWORD_MIN_LENGTH) throw new InvalidArgumentError(`Tu clave debe tener un minimo de ${PARAMETERS.PASSWORD_MIN_LENGTH} carácteres.`);

    if (data.username.length > PARAMETERS.USERNAME_MAX_LENGTH) throw new InvalidArgumentError(`Tu nombre de usuario debe tener un máximo de ${PARAMETERS.USERNAME_MAX_LENGTH} carácteres.`);
    if (data.password.length > PARAMETERS.PASSWORD_MAX_LENGTH) throw new InvalidArgumentError(`Tu clave debe tener un máximo de ${PARAMETERS.PASSWORD_MAX_LENGTH} carácteres.`);

    if (!REGEX.USERNAME.test(data.username)) throw new InvalidArgumentError("Tu nombre de usuario solo puede contener números, letras y guiones bajos.");

    data.password = await Password.hash(data.password);

    const response = await authenticationRepository.signin(data);
    return response;
}

const authenticate = async (data: {
    id: number;
}) => {
    if (!data.id) throw new UnauthorizedError("Datos de autorizacion invalidos.");
    if (isNaN(data.id)) throw new UnauthorizedError("Datos de autorizacion invalidos.");
    if (data.id <= 0) throw new UnauthorizedError("Datos de autorizacio invalidos.");

    const response = await authenticationRepository.getMemberData({ id: data.id });
    const token = await JWT.Generate({ id: response.id, username: response.username, role: response.role }, "30d");
    response.token = token;
    return response;
}

export const authenticationService = {
    login,
    signin,
    authenticate
}