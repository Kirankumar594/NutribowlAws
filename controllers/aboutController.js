// controllers/aboutController.js
import About from '../models/About.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to delete uploaded files
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  }
};

// Get base URL for images
const getImageUrl = (req, filename) => {
  if (!filename) return '';
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

// @desc    Get about us content
// @route   GET /api/about
// @access  Public
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne({ isActive: true });
    
    if (!about) {
      // Create default about content if none exists
      about = new About({
        title: "Your Nutrition Journey Starts Here",
        paragraphs: [
          "At NutriBowl, we believe healthy eating should be simple, satisfying, and sustainable. Founded in 2018 by nutritionist Sarah Chen and chef Michael Rodriguez, we've helped over 50,000 customers achieve their health goals through personalized meal plans.",
          "Our science-backed approach combines the best of nutrition science with culinary excellence.",
          "Whether you're a busy professional, fitness enthusiast, or someone just starting their wellness journey, we make it easy to eat right without the hassle of meal prep or guesswork."
        ],
        bulletPoints: [
          "Macro-balanced meals designed by certified dietitians",
          "Chef-crafted recipes that actually taste delicious",
          "Flexible plans for weight loss, muscle gain, or maintenance",
          "100% organic ingredients sourced from local farmers"
        ],
        teamMembers: [],
        buttonText: "Explore Meal Plans"
      });
      
      await about.save();
    }

    // Convert image filenames to full URLs
    const aboutWithUrls = about.toObject();
    aboutWithUrls.teamMembers = aboutWithUrls.teamMembers.map(member => ({
      ...member,
      image: member.imageFileName ? getImageUrl(req, member.imageFileName) : member.image
    }));

    res.status(200).json({
      success: true,
      data: aboutWithUrls
    });
  } catch (error) {
    console.error('Get About Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create about us content
// @route   POST /api/about
// @access  Private/Admin
export const createAbout = async (req, res) => {
  try {
    const { title, paragraphs, bulletPoints, teamMembers, buttonText } = req.body;

    // Check if about content already exists
    const existingAbout = await About.findOne({ isActive: true });
    if (existingAbout) {
      return res.status(400).json({
        success: false,
        message: 'About content already exists. Use update instead.'
      });
    }

    // Validate required fields
    if (!title || !paragraphs || !bulletPoints || !buttonText) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Parse arrays if they come as strings
    const parsedParagraphs = typeof paragraphs === 'string' ? JSON.parse(paragraphs) : paragraphs;
    const parsedBulletPoints = typeof bulletPoints === 'string' ? JSON.parse(bulletPoints) : bulletPoints;
    const parsedTeamMembers = typeof teamMembers === 'string' ? JSON.parse(teamMembers) : (teamMembers || []);

    const about = new About({
      title,
      paragraphs: parsedParagraphs,
      bulletPoints: parsedBulletPoints,
      teamMembers: parsedTeamMembers,
      buttonText
    });

    await about.save();

    // Convert image filenames to full URLs for response
    const aboutWithUrls = about.toObject();
    aboutWithUrls.teamMembers = aboutWithUrls.teamMembers.map(member => ({
      ...member,
      image: member.imageFileName ? getImageUrl(req, member.imageFileName) : member.image
    }));

    res.status(201).json({
      success: true,
      message: 'About content created successfully',
      data: aboutWithUrls
    });
  } catch (error) {
    console.error('Create About Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update about us content
// @route   PUT /api/about/:id
// @access  Private/Admin
export const updateAbout = async (req, res) => {
  try {
    const { title, paragraphs, bulletPoints, teamMembers, buttonText } = req.body;
    
    let about = await About.findById(req.params.id);
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About content not found'
      });
    }

    // Parse arrays if they come as strings
    const parsedParagraphs = typeof paragraphs === 'string' ? JSON.parse(paragraphs) : paragraphs;
    const parsedBulletPoints = typeof bulletPoints === 'string' ? JSON.parse(bulletPoints) : bulletPoints;
    const parsedTeamMembers = typeof teamMembers === 'string' ? JSON.parse(teamMembers) : (teamMembers || []);

    // Store old team member images for cleanup
    const oldTeamMembers = about.teamMembers || [];

    // Update fields
    about.title = title || about.title;
    about.paragraphs = parsedParagraphs || about.paragraphs;
    about.bulletPoints = parsedBulletPoints || about.bulletPoints;
    about.teamMembers = parsedTeamMembers;
    about.buttonText = buttonText || about.buttonText;

    await about.save();

    // Clean up old images that are no longer used
    oldTeamMembers.forEach(oldMember => {
      const stillUsed = parsedTeamMembers.some(newMember => 
        newMember.imageFileName === oldMember.imageFileName
      );
      if (!stillUsed && oldMember.imageFileName) {
        const filePath = path.join(__dirname, '../uploads/', oldMember.imageFileName);
        deleteFile(filePath);
      }
    });

    // Convert image filenames to full URLs for response
    const aboutWithUrls = about.toObject();
    aboutWithUrls.teamMembers = aboutWithUrls.teamMembers.map(member => ({
      ...member,
      image: member.imageFileName ? getImageUrl(req, member.imageFileName) : member.image
    }));

    res.status(200).json({
      success: true,
      message: 'About content updated successfully',
      data: aboutWithUrls
    });
  } catch (error) {
    console.error('Update About Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete about us content
// @route   DELETE /api/about/:id
// @access  Private/Admin
export const deleteAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About content not found'
      });
    }

    // Delete associated image files
    if (about.teamMembers && about.teamMembers.length > 0) {
      about.teamMembers.forEach(member => {
        if (member.imageFileName) {
          const filePath = path.join(__dirname, '../uploads/', member.imageFileName);
          deleteFile(filePath);
        }
      });
    }

    await About.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'About content deleted successfully'
    });
  } catch (error) {
    console.error('Delete About Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Upload team member image
// @route   POST /api/about/upload-image
// @access  Private/Admin
export const uploadTeamImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const imageUrl = getImageUrl(req, req.file.filename);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        url: imageUrl,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Upload Image Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete uploaded image
// @route   DELETE /api/about/delete-image/:filename
// @access  Private/Admin
export const deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    const filePath = path.join(__dirname, '../uploads/', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    deleteFile(filePath);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete Image Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get all about versions (for admin)
// @route   GET /api/about/all
// @access  Private/Admin
export const getAllAbout = async (req, res) => {
  try {
    const allAbout = await About.find().sort({ createdAt: -1 });

    // Convert image filenames to full URLs
    const aboutWithUrls = allAbout.map(about => {
      const aboutObj = about.toObject();
      aboutObj.teamMembers = aboutObj.teamMembers.map(member => ({
        ...member,
        image: member.imageFileName ? getImageUrl(req, member.imageFileName) : member.image
      }));
      return aboutObj;
    });

    res.status(200).json({
      success: true,
      count: allAbout.length,
      data: aboutWithUrls
    });
  } catch (error) {
    console.error('Get All About Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};