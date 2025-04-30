import { Router } from "express";
import { authenticationController } from "../controllers/authenticationController";

const router: Router = Router();

router.post('/authenticate', authenticationController.authenticate);

router.post('/refresh-token', authenticationController.refreshToken);

router.post('/signin', authenticationController.signin);

router.post('/logout', authenticationController.logout);

router.post('/signup', authenticationController.signup);

router.post('/verify', authenticationController.verify);

router.post('/activate', authenticationController.activate);

router.post('/recover-password', authenticationController.recoverPassword);

router.post('/reset-password', authenticationController.resetPassword);

router.post('/recover-username', authenticationController.recoverUsername);

export default router;