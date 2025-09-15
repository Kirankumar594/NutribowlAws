// routes/solutionRoutes.js
import express from 'express';
import {
  getSolutions,
  createSolution,
  updateSolution,
  deleteSolution
} from '../controllers/solutionController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.route('/')
  .get(getSolutions)
  .post(createSolution);

router.route('/:id')
  .put(updateSolution)
  .delete(deleteSolution);

export default router;