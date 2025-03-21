import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import { tenorController } from "../controllers/tenorController";

const router: Router = Router();

router.get('/', Authorization.Everyone, tenorController.get);

export default router;