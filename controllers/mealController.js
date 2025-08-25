
import MealPlan from '../models/mealModel.js';


export const createMealPlan = async (req, res) => {
  try {
    const { day, vegMeal, nonVegMeal } = req.body;
    const newPlan = new MealPlan({ day, vegMeal, nonVegMeal });
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMealPlanByDay = async (req, res) => {
  try {
    const { day } = req.params;
    const plan = await MealPlan.findOne({ day });
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMealPlan = async (req, res) => {
  try {
    const { day } = req.params;
    const updated = await MealPlan.findOneAndUpdate(
      { day },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Meal plan not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMealPlan = async (req, res) => {
  try {
    const { day } = req.params;
    const deleted = await MealPlan.findOneAndDelete({ day });
    if (!deleted) return res.status(404).json({ error: 'Meal plan not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
