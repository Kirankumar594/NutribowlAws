import WeightLoss from '../models/WeightLossMeal.js';


export const createWeightLossPlan = async (req, res) => {
  try {
    const { day, vegMeal, nonVegMeal } = req.body;
    const newPlan = new WeightLoss({ day, vegMeal, nonVegMeal });
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllWeightLossPlans = async (req, res) => {
  try {
    const plans = await WeightLoss.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWeightLossPlanByDay = async (req, res) => {
  try {
    const { day } = req.params;
    const plan = await WeightLoss.findOne({ day });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateWeightLossPlan = async (req, res) => {
  try {
    const { day } = req.params;
    const updated = await WeightLoss.findOneAndUpdate(
      { day },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Plan not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteWeightLossPlan = async (req, res) => {
  try {
    const { day } = req.params;
    const deleted = await WeightLoss.findOneAndDelete({ day });
    if (!deleted) return res.status(404).json({ error: 'Plan not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
