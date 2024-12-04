import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import { memberController } from "../controllers/memberController";

const router: Router = Router();

router.get('/:username', Authorization.Everyone, memberController.getByUsername);

router.post('/update/name', Authorization.Everyone, memberController.updateName);
router.post('/update/username', Authorization.Everyone, memberController.updateUsername);
router.post('/update/bio', Authorization.Everyone, memberController.updateBio);
router.post('/update/password', Authorization.Everyone, memberController.updatePassword);
router.post('/update/profile-picture', Authorization.Everyone, memberController.updateProfilePicture);

export default router;