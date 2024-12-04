import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import { notificationController } from "../controllers/notificationController";

const router: Router = Router();

router.get('/', Authorization.Everyone, notificationController.get);

export default router;