import { Request, Response } from "express"
import { ResponseError, ResponseOk } from "../helpers/ControllerResponse";
import { RESPONSES } from "../static/responses";
import { followService } from "../services/followService";
import { followsRepository } from "../database/mongo/repositories/follows/follows.repository";

const follow = async (req: Request, res: Response) => {
    try {
        const response = await followService.follow({
            id_member_follower: req.member.id,
            id_member_followed: req.params.id
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
            id_member_followed: req.params.id
        });

        ResponseOk(res, RESPONSES.CREATED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const get = async (req: Request, res: Response) => {
    try {
        const followed = req.query.type == 'followed';
        const followers = req.query.type == 'followers';
        const username = req.query.username as string;
        const olderId = req.query.older_id ? req.query.older_id as string : null;

        const response = await followsRepository.get({
            followedUsername: followers ? username : null,
            followerUsername: followed ? username : null,
            olderId: olderId
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const getRandomFollowers = async (req: Request, res: Response) => {
    try {
        const response = await followService.getRandomFollowers({
            member: req.member
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

export const followController = {
    follow,
    unfollow,
    get,
    getRandomFollowers
}