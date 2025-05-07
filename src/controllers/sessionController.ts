import { Request, Response } from "express";
import { ResponseError, ResponseOk } from "../helpers/ControllerResponse";
import { RESPONSES } from "../static/responses";
import { sessionService } from "../services/sessionService";

const get = async (req: Request, res: Response) => {
    try {
        const response = await sessionService.get({
            member: req.member,
            token: req.cookies['refresh_token']
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    };
};

const close = async (req: Request, res: Response) => {
    try {
        const data = await sessionService.close({
            member: req.member,
            token: req.cookies['refresh_token']
        });

        ResponseOk(res, RESPONSES.OK, data);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    };
};

export const sessionController = {
    get,
    close
};