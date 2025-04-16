import { RESPONSES } from "../static/responses";
import GenericError from "./GenericError";

export default class UnauthorizedError extends GenericError {    
    constructor(_message?: string) {
      super(_message || 'No estás autorizado.', RESPONSES.UNAUTHORIZED);
    }
}