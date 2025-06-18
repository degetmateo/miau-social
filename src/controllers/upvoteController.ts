import { Request, Response } from "express"
import { ResponseError, ResponseOk } from "../helpers/ControllerResponse";
import { RESPONSES } from "../static/responses";
import { upvoteService } from "../services/upvoteService";

const upvote = async (req: Request, res: Response) => {
    try {
        const response = await upvoteService.upvote({
            id_member: req.member.id,
            id_post: req.body.id_post
        });

        ResponseOk(res, RESPONSES.CREATED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const downvote = async (req: Request, res: Response) => {
    try {
        const response = await upvoteService.downvote({
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
    upvote,
    downvote
}