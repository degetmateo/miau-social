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
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const response = await postService.post({
            id_member: Number(req.member.id),
            content: req.body.content ? req.body.content as string : null,
            tenor: [
                req.body['tenor-0'] ? { src: req.body['tenor-0'], index: 0 } : null, 
                req.body['tenor-1'] ? { src: req.body['tenor-1'], index: 1 } : null,
                req.body['tenor-2'] ? { src: req.body['tenor-2'], index: 2 } : null,
                req.body['tenor-3'] ? { src: req.body['tenor-3'], index: 3 } : null
            ].filter(tenor => tenor !== null),
            images: [
                files['image-0'] ? { buffer: files['image-0'][0]['buffer'], index: 0 } : null, 
                files['image-1'] ? { buffer: files['image-1'][0]['buffer'], index: 1 } : null,
                files['image-2'] ? { buffer: files['image-2'][0]['buffer'], index: 2 } : null,
                files['image-3'] ? { buffer: files['image-3'][0]['buffer'], index: 3 } : null
            ].filter(image => image !== null),
            type: req.body.type ? req.body.type as 'default' | 'reply' | 'quote' : 'default',
            target_id: req.body.target_id ? Number(req.body.target_id) : null
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