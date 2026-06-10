import { Request, Response } from "express";
import { RESPONSES } from "../../static/responses";
import { ResponseError, ResponseOk } from "../../helpers/ControllerResponse";
import { publicationsService } from "../../services/publications/publications.service";

export default async (req: Request, res: Response) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const response = await publicationsService.post({
            oomfyId: req.member.id,
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
            target_id: req.body.target_id ? req.body.target_id as string : null,
            spotify_url: req.body.spotify_url ? req.body.spotify_url as string : null
        });

        ResponseOk(res, RESPONSES.CREATED, response);
    } catch (error) {
        console.error(error);
        ResponseError(res, error);
    };
};