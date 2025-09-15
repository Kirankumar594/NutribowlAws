import Specialization from '../models/specialization.js';
import upload from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create new specialization
export const createSpecialization = async (req, res) => {
  try {
    const { title, items } = req.body;
    
    if (!title || !items) {
      return res.status(400).json({ message: 'Title and items are required' });
    }

    let iconPath = '';
    if (req.file) {
      iconPath = req.file.path;
    }

    const newSpecialization = new Specialization({
      title,
      icon: iconPath.replace(/\\/g, '/').split('uploads/')[1], // Store relative path
      items: items.split(',').map(item => item.trim())
    });

    await newSpecialization.save();
    res.status(201).json(newSpecialization);
  } catch (error) {
    console.error('Error creating specialization:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all specializations
export const getSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.find();
    res.json(specializations);
  } catch (error) {
    console.error('Error fetching specializations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Update specialization
export const updateSpecialization = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, items } = req.body;
    
    // Validate input
    if (!id) {
      return res.status(400).json({ message: 'Specialization ID is required' });
    }

    const specialization = await Specialization.findById(id);
    if (!specialization) {
      return res.status(404).json({ message: 'Specialization not found' });
    }

    let iconPath = specialization.icon;
    
    // Handle file upload if present
    if (req.file) {
      // Validate file type
      const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.ico'];
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      
      if (!validExtensions.includes(fileExt)) {
        return res.status(400).json({ 
          message: 'Invalid file type. Only image files are allowed' 
        });
      }

      // Delete old image if exists
      if (specialization.icon) {
        try {
          const oldImagePath = path.join(__dirname, '..', 'uploads', specialization.icon);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }

      // Store just the filename, not the full path
      iconPath = req.file.filename;
    }

    // Prepare updates
    const updates = {
      title: title || specialization.title,
      icon: iconPath,
      items: items ? items.split(',').map(item => item.trim()) : specialization.items
    };

    // Update in database
    const updatedSpecialization = await Specialization.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json(updatedSpecialization);
  } catch (error) {
    console.error('Error updating specialization:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// Delete specialization
export const deleteSpecialization = async (req, res) => {
  try {
    const { id } = req.params;
    
    const specialization = await Specialization.findById(id);
    if (!specialization) {
      return res.status(404).json({ message: 'Specialization not found' });
    }

    // Delete associated image
    if (specialization.icon) {
      const imagePath = path.join(__dirname, '../uploads', specialization.icon);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Specialization.findByIdAndDelete(id);
    res.json({ message: 'Specialization deleted successfully' });
  } catch (error) {
    console.error('Error deleting specialization:', error);
    res.status(500).json({ message: 'Server error' });
  }
};