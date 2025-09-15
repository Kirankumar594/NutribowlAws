
import express from 'express';
import {
  createMealPlan,
  getAllMealPlans,
  getMealPlanByDay,
  updateMealPlan,
  deleteMealPlan
} from '../controllers/mealController.js';


const router = express.Router();

router.post('/', createMealPlan);
router.get('/', getAllMealPlans);
router.get('/:day', getMealPlanByDay);
router.put('/:day', updateMealPlan);
router.delete('/:day', deleteMealPlan);

export default router;

