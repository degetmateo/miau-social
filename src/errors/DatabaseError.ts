import { RESPONSES } from "../static/responses";
import GenericError from "./GenericError";

export default class DatabaseError extends GenericError {    
    constructor(_message?: string) {
      super(_message || 'Ha ocurrido un error.', RESPONSES.INTERNAL_SERVER_ERROR);
    }
}