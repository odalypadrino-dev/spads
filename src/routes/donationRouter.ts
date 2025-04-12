import { Router } from "express";
import donationCtrl from '@controllers/donationCtrl';
import isAuth from '@middlewares/isAuth';

const router = Router();

router.post('/donor/:donorId/donation', isAuth, donationCtrl.addDonation);

router.get('/donor/:donorId/donation', isAuth, donationCtrl.getAll);

router.patch('/donor/:donorId/donation/:dntId/complete', isAuth, donationCtrl.completeDonation);

router.get('/donor/:donorId/checkDonate', isAuth, donationCtrl.checkCanDonate);

export default router;