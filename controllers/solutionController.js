import Solution from '../models/Solution.js';

export const getSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find().sort({ createdAt: -1 });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSolution = async (req, res) => {
  try {
    const { title, description, icon } = req.body;
    
    const solution = new Solution({
      title,
      description,
      icon
    });

    const createdSolution = await solution.save();
    res.status(201).json(createdSolution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSolution = async (req, res) => {
  try {
    const { title, description, icon } = req.body;
    const solution = await Solution.findById(req.params.id);

    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }

    solution.title = title || solution.title;
    solution.description = description || solution.description;
    solution.icon = icon || solution.icon;

    const updatedSolution = await solution.save();
    res.status(200).json(updatedSolution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSolution = async (req, res) => {
  try {
    const solution = await Solution.findByIdAndDelete(req.params.id);

    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }

    res.status(200).json({ message: 'Solution removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
