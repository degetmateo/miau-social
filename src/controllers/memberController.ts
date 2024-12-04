import { Request, Response } from "express"
import { ResponseError, ResponseOk } from "../helpers/ControllerResponse";
import { RESPONSES } from "../static/responses";
import { memberService } from "../services/memberService";

const getByUsername = async (req: Request, res: Response) => {
    try {
        const response = await memberService.getByUsername({
            id_logged_member: req.member.id,
            username: req.params.username
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const updateName = async (req: Request, res: Response) => {
    try {
        const response = await memberService.updateName({
            id_member: req.member.id,
            name: req.body.name
        });

        ResponseOk(res, RESPONSES.ACCEPTED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const updateUsername = async (req: Request, res: Response) => {
    try {
        const response = await memberService.updateUsername({
            id_member: req.member.id,
            username: req.body.username
        });

        ResponseOk(res, RESPONSES.ACCEPTED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const updateBio = async (req: Request, res: Response) => {
    try {
        const response = await memberService.updateBio({
            id_member: req.member.id,
            bio: req.body.bio
        });

        ResponseOk(res, RESPONSES.ACCEPTED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const updatePassword = async (req: Request, res: Response) => {
    try {
        const response = await memberService.updatePassword({
            id_member: req.member.id,
            password: req.body.password,
            new_password: req.body.new_password
        });

        ResponseOk(res, RESPONSES.ACCEPTED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const updateProfilePicture = async (req: Request, res: Response) => {
    try {
        const response = await memberService.updateProfilePicture({
            id_member: req.member.id,
            url: req.body.url
        });

        ResponseOk(res, RESPONSES.ACCEPTED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

export const memberController = {
    getByUsername,
    updateName,
    updateUsername,
    updateBio,
    updatePassword,
    updateProfilePicture
}