import { Router } from 'express';
import { login, logout, getMe, updatePassword } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);

export default router;
