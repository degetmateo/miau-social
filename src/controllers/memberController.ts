import { Request, Response } from "express"
import { ResponseError, ResponseOk, SetRefreshToken } from "../helpers/ControllerResponse";
import { RESPONSES } from "../static/responses";
import { memberService } from "../services/memberService";
import BadGatewayError from "../errors/BadGatewayError";
import { membersRepository } from "../database/mongo/repositories/members/members.repository";

const getByUsername = async (req: Request, res: Response) => {
    try {
        // const response = await memberService.getByUsername({
        //     id_logged_member: req.member.id,
        //     username: req.params.username
        // });

        const response = await membersRepository.get({
            id: null,
            username: req.params.username
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    };
};

const updateName = async (req: Request, res: Response) => {
    try {
        const response = await memberService.updateName({
            id_member: req.member.id as any,
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
            member: req.member,
            token: req.cookies["refresh_token"] as string,
            username: req.body.username
        });

        SetRefreshToken(res, response.refresh_token);
        delete response.refresh_token;
        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    };
};

const updateBio = async (req: Request, res: Response) => {
    try {
        const response = await memberService.updateBio({
            id_member: req.member.id as any,
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
            member: req.member,
            token: req.cookies["refresh_token"] as string,
            password: req.body.password,
            new_password: req.body.new_password
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    };
};

const updateIconURL = async (req: Request, res: Response) => {
    try {
        const response = await memberService.updateIconURL({
            id_member: req.member.id as any,
            url: req.body.url
        });

        ResponseOk(res, RESPONSES.ACCEPTED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const updateIconImage = async (req: Request, res: Response) => {
    try {
        const response = await memberService.updateIconImage({
            id_member: req.member.id as any,
            buffer: req.file.buffer
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const updateBannerURL = async (req: Request, res: Response) => {
    try {
        const response = await memberService.updateBannerURL({
            id_member: req.member.id as any,
            url: req.body.url as string
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const updateBannerImage = async (req: Request, res: Response) => {
    try {
        const response = await memberService.updateBannerImage({
            id_member: req.member.id as any,
            buffer: req.file.buffer
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const updateProfile = async (req: Request, res: Response) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const response = await memberService.updateProfile({
            id_member: req.member.id as any,
            name: req.body.name,
            bio: req.body.bio ? req.body.bio : '',
            location: req.body.location ? req.body.location : '',
            link: req.body.link ? req.body.link : '',
            icon: files?.icon ? files.icon[0].buffer : null,
            icon_action: req.body.icon_action as 'none' | 'update' | 'delete',
            banner: files?.banner ? files.banner[0].buffer : null,
            banner_action: req.body.banner_action as 'none' | 'update' | 'delete'
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const get = async (req: Request, res: Response) => {
    try {
        const search = req.query.search = req.query.search ? req.query.search.toString() : null;
        const data = await memberService.get({
            member: req.member,
            search: search,
            offset: req.query.offset ? parseInt(req.query.offset.toString()) : 0
        });
        ResponseOk(res, RESPONSES.OK, data);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    };
};

export const memberController = {
    getByUsername,
    updateName,
    updateUsername,
    updateBio,
    updatePassword,
    updateIconURL,
    updateIconImage,
    updateBannerURL,
    updateBannerImage,
    updateProfile,
    get
}