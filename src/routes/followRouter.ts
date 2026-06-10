import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import { followController } from "../controllers/followController";

const router: Router = Router();

router.post('/member/:id', Authorization.Everyone, followController.follow);

router.delete('/member/:id', Authorization.Everyone, followController.unfollow);

router.get('/', Authorization.Everyone, followController.get);

router.get('/random', Authorization.Everyone, followController.getRandomFollowers);

export default router;