import { Router } from "express";
import { authenticationController } from "../controllers/authenticationController";
import Authorization from "../middlewares/Authorization";

const router: Router = Router();

router.post('/authenticate', Authorization.Everyone, authenticationController.authenticate);

router.post('/signin', authenticationController.signin);

router.post('/signup', authenticationController.signup);

router.post('/verify', authenticationController.verify);

router.post('/activate', authenticationController.activate);

router.post('/recover-password', authenticationController.recoverPassword);

router.post('/reset-password', authenticationController.resetPassword);

router.post('/recover-username', authenticationController.recoverUsername);

export default router;