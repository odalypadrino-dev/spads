import { Router } from "express";
import donorCtrl from '@controllers/donorCtrl';
import isAuth from '@middlewares/isAuth';

const router = Router();

router.post('/donor/register', isAuth, donorCtrl.register);

router.get('/donor', isAuth, donorCtrl.getAll);

router.get('/donor/:donorId', isAuth, donorCtrl.getById);

router.patch('/donor/:donorId/edit', isAuth, donorCtrl.edit);

export default router;