import { RESPONSES } from "../static/responses";
import GenericError from "./GenericError";

export default class BadGatewayError extends GenericError {    
    constructor(_message?: string) {
      super(_message || 'Ha ocurrido un error.', RESPONSES.BAD_GATEWAY);
    }
}