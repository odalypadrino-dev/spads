import { Router } from "express";

import healthCondCtrl from '@controllers/healthCondCtrl';

import isAuth from '@middlewares/isAuth';

const router = Router();

router.post('/donor/:donorId/healthCondition', isAuth, healthCondCtrl.addHealthCondition);

router.get('/donor/:donorId/healthCondition', isAuth, healthCondCtrl.getHealthConditions);

router.patch('/donor/:donorId/healthCondition/:hcId/end', isAuth, healthCondCtrl.endHealthCondition);

export default router;