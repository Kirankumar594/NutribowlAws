import express from 'express';
import { register, login,getMyProfile,getAllUsers,getUserById } from '../controllers/SignupController.js';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.get('/me', getMyProfile);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
// router.patch('/me', updateMyProfile);

export default router;