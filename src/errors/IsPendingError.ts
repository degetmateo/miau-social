import { RESPONSES } from "../static/responses";
import GenericError from "./GenericError";

export default class IsPendingError extends GenericError {    
    constructor(_message: string) {
      super(_message, RESPONSES.UNAUTHORIZED, 'account-not-activated');
    }
}