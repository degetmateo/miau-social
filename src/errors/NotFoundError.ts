import { RESPONSES } from "../static/responses";
import GenericError from "./GenericError";

export default class NotFoundError extends GenericError {    
    constructor(_message: string) {
      super(_message, RESPONSES.NOT_FOUND);
    }
}