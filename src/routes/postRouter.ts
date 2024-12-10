import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import { postController } from "../controllers/postController";

const router: Router = Router();

router.get('/', Authorization.Everyone, postController.get);

router.get('/following', Authorization.Everyone, postController.getFollowing);

router.get('/:id_post(\\d+)/comments', Authorization.Everyone, postController.getComments);

router.get('/:id_post(\\d+)/thread', Authorization.Everyone, postController.getThread);

router.get('/:id_post(\\d+)', Authorization.Everyone, postController.getById);

router.post('/', Authorization.Everyone, postController.post);

router.delete('/:id_post(\\d+)', Authorization.Everyone, postController.remove);

router.delete('/:id_post(\\d+)/admin', Authorization.Custom(['admin']), postController.removeAdmin);

export default router;