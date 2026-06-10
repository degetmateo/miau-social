import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import Multer from "../middlewares/Multer";
import { publicationsController } from "../controllers/publications/publications.controller";

const router: Router = Router();

router.get('/', Authorization.Everyone, publicationsController.get);

router.post('/', Authorization.Everyone, Multer.MultipleUploads(['image-0', 'image-1', 'image-2', 'image-3']), publicationsController.post);

router.delete('/:id_post(\\d+)', Authorization.Everyone, publicationsController.remove);

router.delete('/:id_post(\\d+)/admin', Authorization.Custom(['admin', 'mod']), publicationsController.adminRemove);

export default router;