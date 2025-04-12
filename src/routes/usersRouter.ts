import { Router } from "express";
import userCtrl from '@controllers/userCtrl';
import isAuth from '@middlewares/isAuth';

const router = Router();

router.post('/register', userCtrl.register);

router.post('/login', userCtrl.login);

router.get('/logout', isAuth, userCtrl.logout);

router.get('/a983bfd8826c0c5cd605a6370cfe02', userCtrl.refreshToken);

router.get('/info', isAuth, userCtrl.getInfo);

export default router;