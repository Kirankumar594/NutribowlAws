import Problem from "../models/Problem.js";
import fs from "fs";
import path from "path";

export const getAllProblems = async (req, res) => {
  const problems = await Problem.find();
  res.json(problems);
};

export const createProblem = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const image = req.file?.filename;

    const newProblem = new Problem({ title, description, category, image });
    await newProblem.save();
    res.status(201).json(newProblem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const image = req.file?.filename;

    const updatedFields = { title, description, category };
    if (image) updatedFields.image = image;

    const updated = await Problem.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Not found" });

    // Delete image from /uploads if exists
    if (problem.image) {
      const imgPath = path.join(process.cwd(), "uploads", problem.image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
