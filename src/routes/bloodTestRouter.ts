import { Router } from "express";

import bloodTestCtrl from '@controllers/bloodTestCtrl';

import isAuth from '@middlewares/isAuth';

const router = Router();

router.post('/donor/:donorId/bloodTest', isAuth, bloodTestCtrl.addBloodTest);

router.get('/donor/:donorId/bloodTest', isAuth, bloodTestCtrl.getBloodTest);

export default router;