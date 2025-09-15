import express from 'express';
import {
  createWeightLossPlan,
  getAllWeightLossPlans,
  getWeightLossPlanByDay,
  updateWeightLossPlan,
  deleteWeightLossPlan
} from '../controllers/weightLossMealController.js';

const router = express.Router();

router.post('/', createWeightLossPlan);
router.get('/', getAllWeightLossPlans);
router.get('/:day', getWeightLossPlanByDay);
router.put('/:day', updateWeightLossPlan);
router.delete('/:day', deleteWeightLossPlan);

export default router;
