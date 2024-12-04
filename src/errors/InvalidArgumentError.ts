import { RESPONSES } from "../static/responses";
import GenericError from "./GenericError";

export default class InvalidArgumentError extends GenericError {    
    constructor(_message: string) {
      super(_message, RESPONSES.NOT_ACCEPTABLE);
    }
}