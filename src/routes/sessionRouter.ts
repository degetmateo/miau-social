import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import { sessionController } from "../controllers/sessionController";

const router: Router = Router();

router.get('/', Authorization.Everyone, sessionController.get);

router.delete('/', Authorization.Everyone, sessionController.close);

export default router;