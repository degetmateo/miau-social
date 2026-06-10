import { Request, Response } from "express";
import { RESPONSES } from "../../static/responses";
import { ResponseError, ResponseOk } from "../../helpers/ControllerResponse";
import { postService } from "../../services/postService";
import { Role } from "../../database/models/Member";

export default async (req: Request, res: Response) => {
    try {
        const response = await postService.removeAdmin({
            id_member: req.member.id as any,
            role_member: req.member.role as Role,
            id_post: Number(req.params.id_post)
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
};