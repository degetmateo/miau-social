import { Request, Response } from "express"
import { ResponseError, ResponseOk } from "../helpers/ControllerResponse";
import { RESPONSES } from "../static/responses";
import { notificationService } from "../services/notificacionService";

const get = async (req: Request, res: Response) => {
    try {
        const response = await notificationService.get({
            id_member: Number(req.member.id),
            offset: req.query.offset ? Number(req.query.offset) : 0
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const read = async (req: Request, res: Response) => {
    try {
        const response = await notificationService.read({
            id_member: Number(req.member.id)
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

export const notificationController = {
    get,
    read
}