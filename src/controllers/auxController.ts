import { Request, Response } from "express";
import { ResponseError, ResponseOk } from "../helpers/ControllerResponse";
import { auxService } from "../services/auxService";
import { RESPONSES } from "../static/responses";

const get = async (req: Request, res: Response) => {
    try {
        const data = await auxService.get({
            member: req.member,
            query: req.query.search as string,
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