import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import { adminController } from "../controllers/adminController";

const router: Router = Router();

router.post('/member/update/password', Authorization.Custom(['admin']), adminController.updatePassword);

export default router;