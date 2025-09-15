import express from 'express';
import {
  getAllProblems,
  createProblem,
  updateProblem,
  deleteProblem
} from '../controllers/problemController.js';
import multer from 'multer';
// import upload from '../middleware/upload.js';

const router = express.Router();
const upload = multer();


router.get('/', getAllProblems);
router.post('/', upload.single('image'), createProblem);
router.put('/:id', upload.single('image'), updateProblem);
router.delete('/:id', deleteProblem);

export default router;
