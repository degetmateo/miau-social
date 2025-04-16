import { RESPONSES } from "../static/responses";
import GenericError from "./GenericError";

export default class MailerError extends GenericError {    
    constructor(_message: string) {
      super(_message, RESPONSES.BAD_REQUEST);
    }
}