import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import { notificationController } from "../controllers/notificationController";

const router: Router = Router();

router.get('/', Authorization.Everyone, notificationController.get);

router.post('/', Authorization.Everyone, notificationController.read);

export default router;