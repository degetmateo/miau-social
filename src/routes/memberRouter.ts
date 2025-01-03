import { Router } from "express";
import Authorization from "../middlewares/Authorization";
import { memberController } from "../controllers/memberController";
import Multer from "../middlewares/Multer";

const router: Router = Router();

router.get('/:username', Authorization.Everyone, memberController.getByUsername);
router.post('/update/name', Authorization.Everyone, memberController.updateName);
router.post('/update/username', Authorization.Everyone, memberController.updateUsername);
router.post('/update/bio', Authorization.Everyone, memberController.updateBio);
router.post('/update/password', Authorization.Everyone, memberController.updatePassword);

router.post('/update/icon/url', Authorization.Everyone, memberController.updateIconURL);
router.post('/update/icon/image', Authorization.Everyone, Multer.Upload('image'), memberController.updateIconImage);

router.post('/update/banner/url', Authorization.Everyone, memberController.updateBannerURL);
router.post('/update/banner/image', Authorization.Everyone, Multer.Upload('image'), memberController.updateBannerImage);

router.post('/update-profile', Authorization.Everyone, Multer.MultipleUploads(['icon', 'banner']), memberController.updateProfile);

export default router;