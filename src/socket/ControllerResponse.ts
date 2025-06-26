import GenericError from "../errors/GenericError";
import { RESPONSES } from "../static/responses";

export async function ResponseOk (func: Function, data?: any, status?: number) {
    if (!func) return;

    func({
        ok: true,
        status: status || RESPONSES.OK,
        data: data
    });
};

export async function ResponseError (func: Function, error: any) {
    if (!func) return;
    
    func({
        ok: false,
        status: error.statusCode || RESPONSES.INTERNAL_SERVER_ERROR,
        error: {
            message: error.message || 'Ocurrió un error inesperado.',
            code: error.code || 'INTERNAL_SERVER_ERROR'
        }
    });

    if (!(error instanceof GenericError)) console.log(error);
};