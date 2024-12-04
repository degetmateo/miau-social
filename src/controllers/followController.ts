import { Request, Response } from "express"
import { ResponseError, ResponseOk } from "../helpers/ControllerResponse";
import { RESPONSES } from "../static/responses";
import { followService } from "../services/followService";

const follow = async (req: Request, res: Response) => {
    try {
        const response = await followService.follow({
            id_member_follower: req.member.id,
            id_member_followed: Number(req.params.id_member)
        });

        ResponseOk(res, RESPONSES.CREATED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const unfollow = async (req: Request, res: Response) => {
    try {
        const response = await followService.unfollow({
            id_member_follower: req.member.id,
            id_member_followed: Number(req.params.id_member)
        });

        ResponseOk(res, RESPONSES.CREATED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

export const followController = {
    follow,
    unfollow
}