import { Request, Response } from "express"
import { ResponseError, ResponseOk } from "../helpers/ControllerResponse";
import { RESPONSES } from "../static/responses";
import { upvoteService } from "../services/upvoteService";

const post = async (req: Request, res: Response) => {
    try {
        const response = await upvoteService.post({
            id_member: req.member.id,
            id_post: req.body.id_post
        });

        ResponseOk(res, RESPONSES.CREATED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const remove = async (req: Request, res: Response) => {
    try {
        const response = await upvoteService.remove({
            id_member: req.member.id,
            id_post: req.body.id_post
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

export const upvoteController = {
    post,
    remove
}