import { Request, Response } from "express"
import { ResponseError, ResponseOk } from "../helpers/ControllerResponse";
import { RESPONSES } from "../static/responses";
import { authenticationService } from "../services/authenticationService";

const login = async (req: Request, res: Response) => {
    try {
        const response = await authenticationService.login({
            username: req.body.username,
            password: req.body.password
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const signin = async (req: Request, res: Response) => {
    try {
        const response = await authenticationService.signin({
            username: req.body.username as string,
            password: req.body.password as string
        });

        ResponseOk(res, RESPONSES.CREATED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

const authenticate = async (req: Request, res: Response) => {
    try {
        const response = await authenticationService.authenticate({
            id: req.member.id
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

export const authenticationController = {
    login,
    signin,
    authenticate
}