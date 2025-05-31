import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import { auxController } from "../controllers/auxController";

const router: Router = Router();

router.get('/search', Authorization.Everyone, auxController.get);

export default router;