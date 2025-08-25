import Plan from "../models/PlanModel.js";

// Create
export const createPlan = async (req, res) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all by type
export const getPlansByType = async (req, res) => {
  try {
    const plans = await Plan.find({ planType: req.params.type });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get one by ID
export const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: "Plan not found" });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
export const updatePlan = async (req, res) => {
  try {
    const updated = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Plan not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete
export const deletePlan = async (req, res) => {
  try {
    const deleted = await Plan.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Plan not found" });
    res.json({ message: "Plan deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
