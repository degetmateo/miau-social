import { Request, Response } from "express";
import { publicationsRepository } from "../../database/mongo/repositories/publications/publications.repository";
import { RESPONSES } from "../../static/responses";
import { ResponseError, ResponseOk } from "../../helpers/ControllerResponse";

export default async (req: Request, res: Response) => {
    try {
        const response = await publicationsRepository.get({
            olderPublicationId: req.query.olderPublicationId as string,
            authorUsername: req.query.authorUsername as string,
            _id: req.query._id as string,
            targetPublicationId: req.query.targetPublicationId as string,
            rootPublicationId: req.query.rootPublicationId as string,
            type: req.query.type as string
        });

        ResponseOk(res, RESPONSES.OK, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    };
};