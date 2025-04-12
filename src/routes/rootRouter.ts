import { Router } from "express";

import rootCtrl from '@controllers/rootCtrl';

import isRoot from "@middlewares/isRoot";
import isAuth from '@middlewares/isAuth';

const router = Router();

router.get('/logs', isAuth, isRoot, rootCtrl.getLogs);

export default router;