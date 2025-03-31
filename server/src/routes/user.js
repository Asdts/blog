import { Router } from 'express';
import { createUser, loginUser, verifyUser, follow , unfollow } from '../controllers/user.js';


const router = Router();

router.post('/create', createUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyUser);
router.post('/follow', follow);
router.post('/unfollow', unfollow);

export default router;