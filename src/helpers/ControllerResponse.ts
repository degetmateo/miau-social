import { Response } from 'express';
import GenericError from '../errors/GenericError';
import { RESPONSES } from '../static/responses';

export const ResponseOk = (res: Response, statusCode: number, data: any) => {
    return res.status(statusCode).json({ data });
};

export const ResponseRefreshToken = (res: Response, token: string) => {
    res.cookie("refresh-token", token, {
        httpOnly: true,
        secure: process.env.PRODUCTION === "TRUE",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

export const ResponseError = (res: Response, error: any) => {
    if (error instanceof GenericError) return res.status(error.statusCode).json({ error: { message: error.message, code: error.code } });
    else return res.status(RESPONSES.INTERNAL_SERVER_ERROR).json({ error: { message: "Ha ocurrido un error inesperado." } });
};