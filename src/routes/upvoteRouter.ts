import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import { upvoteController } from "../controllers/upvoteController";

const router: Router = Router();

router.post('/', Authorization.Everyone, upvoteController.upvote);

router.delete('/', Authorization.Everyone, upvoteController.downvote);

export default router;