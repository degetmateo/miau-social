import { Request, Response } from "express"
import { ResponseError, ResponseOk } from "../helpers/ControllerResponse";
import { RESPONSES } from "../static/responses";
import { postService } from "../services/postService";
import { Role } from "../database/models/Member";

const get = async (req: Request, res: Response) => {
    try {
        const response = await postService.get({
            member: req.member,
            offset: req.query.offset ? Number(req.query.offset) : 0,
            id_member: req.query.id_member ? Number(req.query.id_member) : null,
            username: req.query.username ? req.query.username as string : null
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const getFollowing = async (req: Request, res: Response) => {
    try {
        const response = await postService.getFollowing({
            member: req.member,
            offset: req.query.offset ? Number(req.query.offset) : 0
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const getById = async (req: Request, res: Response) => {
    try {
        const response = await postService.getById({
            id_member: Number(req.member.id),
            id_post: Number(req.params.id_post)
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const getComments = async (req: Request, res: Response) => {
    try {
        const response = await postService.getComments({
            id_member: Number(req.member.id),
            id_post: Number(req.params.id_post)
        });
        
        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const getThread = async (req: Request, res: Response) => {
    try {
        const response = await postService.getThread({
            id_member: Number(req.member.id),
            id_post: Number(req.params.id_post)
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const post = async (req: Request, res: Response) => {
    try {
        const response = await postService.post({
            id_member: Number(req.member.id),
            content: req.body.content,
            images: req.body.images,
            id_replied_post: req.body.id_replied_post ? Number(req.body.id_replied_post) : null
        });

        ResponseOk(res, RESPONSES.CREATED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const remove = async (req: Request, res: Response) => {
    try {
        const response = await postService.remove({
            id_member: req.member.id,
            id_post: Number(req.params.id_post)
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const removeAdmin = async (req: Request, res: Response) => {
    try {
        const response = await postService.removeAdmin({
            id_member: req.member.id,
            role_member: req.member.role as Role,
            id_post: Number(req.params.id_post)
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

export const postController = {
    get,
    getFollowing,
    getById,
    getComments,
    getThread,
    post,
    remove,
    removeAdmin
}