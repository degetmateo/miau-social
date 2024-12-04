import { Response } from 'express';
import GenericError from '../errors/GenericError';
import { RESPONSES } from '../static/responses';

export const ResponseOk = (res: Response, statusCode: number, data: any) => {
    return res.status(statusCode).json({ data });
};

export const ResponseError = (res: Response, error: any) => {
    if (error instanceof GenericError) return res.status(error.statusCode).json({ error: { message: error.message } });
    else return res.status(RESPONSES.INTERNAL_SERVER_ERROR).json({ error: { message: "Ha ocurrido un error inesperado." } });
};