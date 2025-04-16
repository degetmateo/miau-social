import InvalidArgumentError from "../errors/InvalidArgumentError";
import UnauthorizedError from "../errors/UnauthorizedError";
import { PARAMETERS } from "../static/parameters";

class Validator {
    public readonly REGEX_EMAIL: RegExp;
    public readonly REGEX_USERNAME: RegExp;

    constructor () {
        this.REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.REGEX_USERNAME = /^[a-zA-Z0-9_]+$/;
    }

    Id (value: number) {
        if (!value) throw new UnauthorizedError("Datos de autorizacion invalidos.");
        if (isNaN(value)) throw new UnauthorizedError("Datos de autorizacion invalidos.");
        if (value <= 0) throw new UnauthorizedError("Datos de autorizacio invalidos.");
    }

    Email (value: string) {
        if (!value) throw new InvalidArgumentError('Tu correo eletrónico es necesario.');
        if (!value.trim()) throw new InvalidArgumentError('Tu correo electrónico no puede estar vacío.');
        if (value.length > PARAMETERS.EMAIL_MAX_LENGTH) throw new InvalidArgumentError("Tu correo elentrónico no puede ser tan largo.");
        if (!this.REGEX_EMAIL.test(value)) throw new InvalidArgumentError('Tu correo electrónico no es válido.');
    }

    Username (value: string) {
        if (!value) throw new InvalidArgumentError('Tu nombre de usuario es necesario.');
        if (!value.trim()) throw new InvalidArgumentError('Tu nombre de usuario no puede estar vacío.');
        if (value.length < PARAMETERS.USERNAME_MIN_LENGTH) throw new InvalidArgumentError(`Tu nombre de usuario debe tener un mínimo de ${PARAMETERS.USERNAME_MIN_LENGTH} carácteres.`);
        if (value.length > PARAMETERS.USERNAME_MAX_LENGTH) throw new InvalidArgumentError(`Tu nombre de usuario debe tener un máximo de ${PARAMETERS.USERNAME_MAX_LENGTH} carácteres.`);
        if (!this.REGEX_USERNAME.test(value)) throw new InvalidArgumentError('Tu nombre de usuario solo puede contener números, letras y guiones bajos.');
    }

    Name (value: string) {
        if (!value) throw new InvalidArgumentError('Tu nombre es necesario.');
        if (!value.trim()) throw new InvalidArgumentError('Tu nombre no puede estar vacío.');
        if (value.length < PARAMETERS.NAME_MIN_LENGTH) throw new InvalidArgumentError(`Tu nombre debe tener un mínimo de ${PARAMETERS.NAME_MIN_LENGTH} carácteres.`);
        if (value.length > PARAMETERS.NAME_MAX_LENGTH) throw new InvalidArgumentError(`Tu nombre debe tener un máximo de ${PARAMETERS.NAME_MAX_LENGTH} carácteres.`);
    }

    Password (value: string) {
        if (!value) throw new InvalidArgumentError('Tu clave es necesaria.');
        if (!value.trim()) throw new InvalidArgumentError('Tu clave no puede estar vacía.');
        if (value.length < PARAMETERS.PASSWORD_MIN_LENGTH) throw new InvalidArgumentError(`Tu clave debe tener un mínimo de ${PARAMETERS.PASSWORD_MIN_LENGTH} carácteres.`);
        if (value.length > PARAMETERS.PASSWORD_MAX_LENGTH) throw new InvalidArgumentError(`Tu clave debe tener un máximo de ${PARAMETERS.PASSWORD_MAX_LENGTH} carácteres.`);
    }
}

export default new Validator();