import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import { shareController } from "../controllers/shareController";

const router: Router = Router();

router.put('/', Authorization.Everyone, shareController.share);

router.delete('/', Authorization.Everyone, shareController.unshare);

export default router;