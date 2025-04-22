import { Request, Response } from "express"
import { ResponseError, ResponseOk, ResponseRefreshToken } from "../helpers/ControllerResponse";
import { RESPONSES } from "../static/responses";
import { authenticationService } from "../services/authenticationService";

const authenticate = async (req: Request, res: Response) => {
    try {
        const data = await authenticationService.authenticate({
            id: req.member.id,
            username: req.member.username,
            role: req.member.role,
            email: req.member.email
        });

        ResponseOk(res, RESPONSES.OK, data);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const signin = async (req: Request, res: Response) => {
    try {
        const data = await authenticationService.signin({
            username: req.body.username as string,
            password: req.body.password as string,
            ip: req.ip || req.socket.remoteAddress,
            platform: req.body.platform as string,
            captcha_token: req.body.captcha_token as string
        });

        // const REFRESH_TOKEN = data.refresh_token;
        // delete data.refresh_token;

        // ResponseRefreshToken(res, REFRESH_TOKEN);
        ResponseOk(res, RESPONSES.OK, data);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const signup = async (req: Request, res: Response) => {
    try {
        const response = await authenticationService.signup({
            email: req.body.email as string,
            username: req.body.username as string,
            name: req.body.name as string,
            password: req.body.password as string,
            captcha_token: req.body.captcha_token as string
        });

        ResponseOk(res, RESPONSES.CREATED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const verify = async (req: Request, res: Response) => {
    try {
        const response = await authenticationService.verify({
            token: req.body.token as string
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const activate = async (req: Request, res: Response) => {
    try {
        const response = await authenticationService.activate({
            username: req.body.username as string,
            email: req.body.email as string,
            password: req.body.password as string,
            captcha_token: req.body.captcha_token as string
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const recoverPassword = async (req: Request, res: Response) => {
    try {
        const response = await authenticationService.recoverPassword({
            token: req.body.token as string,
            username: req.body.username as string
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const resetPassword = async (req: Request, res: Response) => {
    try {
        const response = await authenticationService.resetPassword({
            grecaptcha_token: req.body.grecaptcha_token as string,
            token: req.body.token as string,
            password: req.body.password as string
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const recoverUsername = async (req: Request, res: Response) => {
    try {
        const response = await authenticationService.recoverUsername({
            token: req.body.token as string,
            email: req.body.email as string
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

export const authenticationController = {
    authenticate,
    signin,
    signup,
    verify,
    activate,
    recoverPassword,
    resetPassword,
    recoverUsername
}