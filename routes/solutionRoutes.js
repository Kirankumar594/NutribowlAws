// routes/solutionRoutes.js
import express from 'express';
import {
  getSolutions,
  createSolution,
  updateSolution,
  deleteSolution
} from '../controllers/solutionController.js';

const router = express.Router();

router.route('/')
  .get(getSolutions)
  .post(createSolution);

router.route('/:id')
  .put(updateSolution)
  .delete(deleteSolution);

export default router;