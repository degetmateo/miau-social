import { Router } from "express";
import { authenticationController } from "../controllers/authenticationController";
import Authorization from "../middlewares/Authorization";

const router: Router = Router();

router.post('/login', authenticationController.login);

router.post('/signin', authenticationController.signin);

router.post('/authenticate', Authorization.Everyone, authenticationController.authenticate);

export default router;