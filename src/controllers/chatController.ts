import { Request, Response } from "express";
import { ResponseError, ResponseOk } from "../helpers/ControllerResponse";
import { chatService } from "../services/chatService";
import { RESPONSES } from "../static/responses";

const get = async (req: Request, res: Response) => {
    try {
        const data = await chatService.get({
            member: req.member,
            offset: req.query.offset ? Number(req.query.offset) : 0
        });

        ResponseOk(res, RESPONSES.OK, data);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    };
};

const post = async (req: Request, res: Response) => {
    try {
        const data = await chatService.post({
            member: req.member,
            username: req.body.username
        });

        ResponseOk(res, RESPONSES.CREATED, data);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    };
};

export const chatController = {
    post,
    get
};