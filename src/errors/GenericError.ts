export default class GenericError extends Error {
    public statusCode: number;
    public code: string;

    constructor (_message: string, _statusCode: number, _code?: string) {
        super(_message);
        this.statusCode = _statusCode;
        this.code = _code || null;
    }

    serializeErrors() {
        return [{ message: this.message, statusCode: this.statusCode, code: this.code }];
    }
}
  