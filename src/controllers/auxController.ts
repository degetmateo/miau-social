import { Request, Response } from "express";
import { ResponseError, ResponseOk } from "../helpers/ControllerResponse";
import { auxService } from "../services/auxService";
import { RESPONSES } from "../static/responses";

const get = async (req: Request, res: Response) => {
    try {
        const data = await auxService.get({
            member: req.member,
            query: req.query.search as string,
            filter: req.query.filter ? req.query.filter as any : 'posts',
            offset: parseInt(req.query.offset as string) || 0
        });

        ResponseOk(res, RESPONSES.OK, data);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    };
};

export const auxController = {
    get
};