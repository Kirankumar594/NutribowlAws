import express from 'express';
import {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/OurTeamController.js';
// import upload from '../middleware/upload.js';
import multer from 'multer';

const upload = multer();
const router = express.Router();

// Routes
router.post('/', upload.single('image'), createTeamMember);
router.get('/', getAllTeamMembers);
router.get('/:id', getTeamMemberById);
router.put('/:id', upload.single('image'), updateTeamMember);
router.delete('/:id', deleteTeamMember);

export default router;