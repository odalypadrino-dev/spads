import { Router } from "express";

import adminCtrl from '@controllers/adminCtrl';

import isRootAdmin from "@middlewares/isRootAdmin";
import isAuth from '@middlewares/isAuth';

const router = Router();

router.get('/stats', isAuth, isRootAdmin, adminCtrl.getStats);

export default router;