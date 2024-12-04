export default class GenericError extends Error {
    public statusCode: number;

    constructor (_message: string, _statusCode: number) {
        super(_message);
        this.statusCode = _statusCode;
    }

    serializeErrors() {
        return [{ message: this.message, statusCode: this.statusCode }];
    }
}
  