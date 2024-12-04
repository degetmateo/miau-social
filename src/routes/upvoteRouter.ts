import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import { upvoteController } from "../controllers/upvoteController";

const router: Router = Router();

router.post('/', Authorization.Everyone, upvoteController.post);

router.delete('/', Authorization.Everyone, upvoteController.remove);

export default router;