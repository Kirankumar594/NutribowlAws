import express from "express";
const router = express.Router();
import Challenge from "../models/Challenge.js"; // Mongoose model


// Get all
router.get("/", async (req, res) => {
  const challenges = await Challenge.find().sort({ createdAt: -1 });
  res.json(challenges);
});

// Add new
router.post("/", async (req, res) => {
  const challenge = new Challenge(req.body);
  await challenge.save();
  res.json(challenge);
});

// Update
router.put("/:id", async (req, res) => {
  const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(challenge);
});

// Delete
router.delete("/:id", async (req, res) => {
  await Challenge.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
