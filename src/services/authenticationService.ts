import { authenticationRepository } from "../database/repository/authenticationRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";
import UnauthorizedError from "../errors/UnauthorizedError";
import UnexpectedError from "../errors/UnexpectedError";
import JWT from "../helpers/JWT";
import ReCaptcha from "../helpers/ReCaptcha";
import Validator from "../helpers/Validator";
import { PARAMETERS } from "../static/parameters";

const authenticate = async (data: {
    token: string;
}) => {
    if (!data.token) throw new UnauthorizedError("No estás autorizado.");
    return await authenticationRepository.Authenticate(data);
}

const refreshToken = async (data: {
    token: string;
}) => {
    if (!data.token) throw new UnauthorizedError("No estás autorizado.");
    return await authenticationRepository.RefreshToken(data);
}

const signin = async (data: {
    username: string;
    password: string;
    ip: string;
    platform: string;
    captcha_token: string;
}) => {
    if (!data.username) throw new InvalidArgumentError("Debes ingresar tu nombre de usuario.");
    if (!data.username.trim()) throw new InvalidArgumentError("Debes ingresar tu nombre de usuario.");

    if (!data.password) throw new InvalidArgumentError("Debes ingresar tu clave.");
    if (!data.password.trim()) throw new InvalidArgumentError("Debes ingresar tu clave.");
    if (data.password.length > PARAMETERS.PASSWORD_MAX_LENGTH) throw new UnexpectedError();

    Validator.Ip(data.ip);
    
    if (process.env.PRODUCTION === "TRUE") {
        Validator.Platform(data.platform);
        await ReCaptcha.Verify(data.captcha_token);
    }

    return await authenticationRepository.Signin(data);
}

const signup = async (data: {
    email: string;
    username: string;
    name: string;
    password: string;
    captcha_token: string;
}) => {
    Validator.Email(data.email);
    Validator.Username(data.username);
    Validator.Name(data.name);
    Validator.Password(data.password);

    if (process.env.PRODUCTION === 'TRUE') {
        const recaptchaResponse = await ReCaptcha.Verify(data.captcha_token);
        
        if (!recaptchaResponse.success) throw new UnauthorizedError('Ha ocurrido un error de autorización.');
        if (recaptchaResponse.score <= PARAMETERS.RECAPTCHA_SCORE) throw new UnauthorizedError('Ha ocurrido un error de autorización.');
    }

    return await authenticationRepository.Signup(data);
}

const verify = async (data: {
    token: string;
    ip: string;
    platform: string;
}) => {
    if (!data.token) throw new UnauthorizedError("Ha ocurrido un error de autorización.");

    const tokenData: {
        id: number;
        username: string;
        email: string;
        role: string;
    } = JWT.Validate(data.token);

    return await authenticationRepository.Verify({
        ...tokenData,
        ip: data.ip,
        platform: data.platform
    });
}

const activate = async (data: {
    username: string;
    email: string;
    password: string;
    captcha_token: string;
}) => {
    if (!data.username) throw new InvalidArgumentError('Tenés que ingresar tu nombre de usuario.');
    if (!data.username.trim()) throw new InvalidArgumentError('Tenés que ingresar tu nombre de usuario.');
    Validator.Email(data.email);
    if (!data.password) throw new InvalidArgumentError('Tenés que ingresar tu clave.');
    if (!data.password.trim()) throw new InvalidArgumentError('Tenés que ingresar tu clave.');

    const recaptchaResponse = await ReCaptcha.Verify(data.captcha_token);
    
    if (!recaptchaResponse.success) throw new UnauthorizedError('Ha ocurrido un error de autorización.');
    if (recaptchaResponse.score <= PARAMETERS.RECAPTCHA_SCORE) throw new UnauthorizedError('Ha ocurrido un error de autorización.');

    return await authenticationRepository.Activate(data);
}

const recoverPassword = async (data: {
    token: string;
    username: string;
}) => {
    if (!data.username) throw new InvalidArgumentError('Tenés que ingresar tu nombre de usuario.');
    if (!data.username.trim()) throw new InvalidArgumentError('Tenés que ingresar tu nombre de usuario.');
    if (!data.token) throw new UnauthorizedError('Ha ocurrido un error de autorización.');
    if (!data.token.trim()) throw new UnauthorizedError('Ha ocurrido un error de autorización.');

    const grecaptcha = await ReCaptcha.Verify(data.token);
    if (!grecaptcha.success) throw new UnauthorizedError();
    if (grecaptcha.score <= PARAMETERS.RECAPTCHA_SCORE) throw new UnauthorizedError();

    return await authenticationRepository.RecoverPassword(data);
}

const resetPassword = async (data: {
    grecaptcha_token: string;
    token: string;
    password: string;
}) => {
    Validator.Password(data.password);

    if (!data.token || !data.token.trim()) throw new UnauthorizedError();
    if (!data.grecaptcha_token || !data.grecaptcha_token.trim()) throw new UnauthorizedError();

    const member = await JWT.Validate(data.token);

    const grecaptcha = await ReCaptcha.Verify(data.grecaptcha_token);
    if (!grecaptcha.success) throw new UnauthorizedError();
    if (grecaptcha.score <= PARAMETERS.RECAPTCHA_SCORE) throw new UnauthorizedError();

    return await authenticationRepository.ResetPassword({
        id: member.id,
        username: member.username,
        email: member.email,
        password: data.password
    });
}

const recoverUsername = async (data: {
    email: string;
    token: string;
}) => {
    Validator.Email(data.email);

    if (!data.token || !data.token.trim()) throw new UnauthorizedError();

    const grecaptcha = await ReCaptcha.Verify(data.token);
    if (!grecaptcha.success) throw new UnauthorizedError();
    if (grecaptcha.score <= PARAMETERS.RECAPTCHA_SCORE) throw new UnauthorizedError();

    return await authenticationRepository.RecoverUsername(data);
}

const logout = async (data: {
    token: string;
}) => {
    if (!data.token) throw new UnauthorizedError("No estás autorizado.");
    return await authenticationRepository.Logout(data);
};

export const authenticationService = {
    authenticate,
    refreshToken,
    signin,
    logout,
    signup,
    verify,
    activate,
    recoverPassword,
    resetPassword,
    recoverUsername
}