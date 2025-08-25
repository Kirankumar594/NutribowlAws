import Expert from '../models/expertModel.js';
import upload from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current module's file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// @desc    Get all experts
// @route   GET /api/experts
// @access  Public
export const getExperts = async (req, res) => {
  try {
    const experts = await Expert.find({});
    res.json(experts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create an expert
// @route   POST /api/experts
// @access  Private/Admin
export const createExpert = async (req, res) => {
  try {
    const { name, title, bio } = req.body;
    
    // If no file was uploaded but there's an existing image URL
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    const expert = new Expert({
      name,
      title,
      bio,
      image
    });

    const createdExpert = await expert.save();
    res.status(201).json(createdExpert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// @desc    Update an expert
// @route   PUT /api/experts/:id
// @access  Private/Admin
export const updateExpert = async (req, res) => {
  try {
    const { name, title, bio } = req.body;
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    // Update basic fields
    expert.name = name || expert.name;
    expert.title = title || expert.title;
    expert.bio = bio || expert.bio;

    // Handle image update
    if (req.file) {
      // Delete old image if it exists (and it's not a URL)
      if (expert.image && !expert.image.startsWith('http')) {
        const oldImagePath = path.join(__dirname, '..', expert.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      // Set new image path
      expert.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image && req.body.image !== expert.image) {
      // Handle case where image URL is provided directly
      expert.image = req.body.image;
    }

    const updatedExpert = await expert.save();
    res.json(updatedExpert);
  } catch (error) {
    console.error('Update Expert Error:', error);
    res.status(500).json({ 
      message: 'Server Error',
      error: error.message 
    });
  }
};

// @desc    Delete an expert
// @route   DELETE /api/experts/:id
// @access  Private/Admin
// export const deleteExpert = async (req, res) => {
//   try {
//     const expert = await Expert.findById(req.params.id);

//     if (expert) {
//       // Delete associated image if it exists
//       if (expert.image && !expert.image.startsWith('http')) {
//         const imagePath = path.join(__dirname, '..', expert.image);
//         if (fs.existsSync(imagePath)) {
//           fs.unlinkSync(imagePath);
//         }
//       }

//       await expert.remove();
//       res.json({ message: 'Expert removed' });
//     } else {
//       res.status(404);
//       throw new Error('Expert not found');
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };
// @desc    Delete an expert
// @route   DELETE /api/experts/:id
// @access  Private/Admin
export const deleteExpert = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    // Delete associated image if it exists and is not an external URL
    if (expert.image && !expert.image.startsWith('http')) {
      const imagePath = path.join(__dirname, '..', expert.image.replace(/^\/+/, '')); 
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Correct way to delete in Mongoose v7
    await Expert.deleteOne({ _id: expert._id });

    res.json({ message: 'Expert removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Expert not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single expert by ID
// @route   GET /api/experts/:id
// @access  Public
export const getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    res.json(expert);
  } catch (error) {
    console.error(error);
    // Invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Expert not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};