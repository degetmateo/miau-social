import { RESPONSES } from "../static/responses";
import GenericError from "./GenericError";

export default class BadGatewayError extends GenericError {    
    constructor(message?: string) {
      super(message || 'Ha ocurrido un error.', RESPONSES.BAD_GATEWAY);
    }
}