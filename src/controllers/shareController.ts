import { Request, Response } from "express";
import { shareService } from "../services/shareService";
import { ResponseError, ResponseOk } from "../helpers/ControllerResponse";
import { RESPONSES } from "../static/responses";

const share = async (req: Request, res: Response) => {
    try {
        const data = await shareService.share({
            member: req.member,
            id: Number(req.query.id)
        });

        ResponseOk(res, RESPONSES.OK, data);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    };
};

const unshare = async (req: Request, res: Response) => {
    try {
        const data = await shareService.unshare({
            member: req.member,
            id: Number(req.query.id)
        });

        ResponseOk(res, RESPONSES.OK, data);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    };
};

export const shareController = {
    share,
    unshare
};