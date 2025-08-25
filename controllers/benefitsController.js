import Benefit from '../models/Benefit.js';

// @desc    Get all benefits
// @route   GET /api/benefits
// @access  Public
export const getBenefits = async (req, res) => {
  try {
    const benefits = await Benefit.find().sort({ createdAt: -1 });
    res.status(200).json(benefits);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a benefit
// @route   POST /api/benefits
// @access  Private/Admin
export const createBenefit = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an icon' });
    }

    const iconPath = `/uploads/${req.file.filename}`;

    const benefit = new Benefit({
      title,
      description,
      icon: iconPath
    });

    const createdBenefit = await benefit.save();
    res.status(201).json(createdBenefit);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Update a benefit
// @route   PUT /api/benefits/:id
// @access  Private/Admin
export const updateBenefit = async (req, res) => {
  try {
    const { title, description } = req.body;
    const benefit = await Benefit.findById(req.params.id);

    if (!benefit) {
      return res.status(404).json({ message: 'Benefit not found' });
    }

    let iconPath = benefit.icon;
    if (req.file) {
      iconPath = `/uploads/${req.file.filename}`;
      // TODO: Delete old icon file from server
    }

    benefit.title = title || benefit.title;
    benefit.description = description || benefit.description;
    benefit.icon = iconPath;

    const updatedBenefit = await benefit.save();
    res.status(200).json(updatedBenefit);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Delete a benefit
// @route   DELETE /api/benefits/:id
// @access  Private/Admin
export const deleteBenefit = async (req, res) => {
  try {
    const benefit = await Benefit.findById(req.params.id);

    if (!benefit) {
      return res.status(404).json({ message: 'Benefit not found' });
    }

    // TODO: Delete icon file from server before deleting record
    await benefit.remove();
    res.status(200).json({ message: 'Benefit removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};