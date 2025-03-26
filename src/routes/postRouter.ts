import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import { postController } from "../controllers/postController";
import Multer from "../middlewares/Multer";

const router: Router = Router();

router.get('/', Authorization.Everyone, postController.get);

router.get('/following', Authorization.Everyone, postController.getFollowing);

router.get('/:id_post(\\d+)/replies', Authorization.Everyone, postController.getComments);

router.get('/:id_post(\\d+)/thread', Authorization.Everyone, postController.getThread);

router.get('/:id_post(\\d+)', Authorization.Everyone, postController.getById);

router.post('/', Authorization.Everyone, Multer.MultipleUploads(['image-0', 'image-1', 'image-2', 'image-3']), postController.post);

router.delete('/:id_post(\\d+)', Authorization.Everyone, postController.remove);

router.delete('/:id_post(\\d+)/admin', Authorization.Custom(['admin']), postController.removeAdmin);

export default router;