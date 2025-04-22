import { RESPONSES } from "../static/responses";
import GenericError from "./GenericError";

export default class UnexpectedError extends GenericError {    
    constructor(message?: string, code?: string) {
        message = message || "Ha ocurrido un error inesperado.";
        code = code || "UNEXPECTED_ERROR";
        super(message, RESPONSES.INTERNAL_SERVER_ERROR, code);
    }
}