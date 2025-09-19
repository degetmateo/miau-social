import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import { chatController } from "../controllers/chatController";

const router: Router = Router();

router.get('/', Authorization.Everyone, chatController.get);
router.post('/', Authorization.Everyone, chatController.post);

export default router;