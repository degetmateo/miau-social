import { RESPONSES } from "../static/responses";
import GenericError from "./GenericError";

export default class UnauthorizedError extends GenericError {    
    constructor(message?: string, code?: string) {
      super(
        message || 'No estás autorizado.', 
        RESPONSES.UNAUTHORIZED, 
        code || 'UNAUTHORIZED'
      );
    }
}