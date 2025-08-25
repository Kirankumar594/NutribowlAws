import express from 'express';
import { loginAdmin, logoutAdmin, getCurrentAdmin } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', authMiddleware, getCurrentAdmin);

export default router;