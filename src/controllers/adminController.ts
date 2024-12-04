import { Request, Response } from "express"
import { ResponseError, ResponseOk } from "../helpers/ControllerResponse";
import { RESPONSES } from "../static/responses";
import { adminService } from "../services/adminService";

const updatePassword = async (req: Request, res: Response) => {
    try {
        const response = await adminService.updatePassword({
            username: req.body.username,
            password: req.body.password
        });

        ResponseOk(res, RESPONSES.ACCEPTED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    }
}

export const adminController = {
    updatePassword
}