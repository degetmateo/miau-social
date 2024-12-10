import { RESPONSES } from "../static/responses";
import GenericError from "./GenericError";

export default class ServiceUnavaiableError extends GenericError {    
    constructor(_message?: string) {
      super(_message || 'Ha ocurrido un error.', RESPONSES.SERVICE_UNAVAIABLE);
    }
}