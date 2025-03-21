import { Request, Response } from "express"
import { ResponseError, ResponseOk } from "../helpers/ControllerResponse";
import { RESPONSES } from "../static/responses";
import { tenorService } from "../services/tenorService";

const get = async (req: Request, res: Response) => {
    try {
        const response = await tenorService.get({
            member: req.member,
            pos: req.query.pos ? req.query.pos as string : null,
            args: req.query.args ? req.query.args as string : null
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

export const tenorController = {
    get
}