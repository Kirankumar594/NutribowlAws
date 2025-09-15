import Story from '../models/StoryModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadFile2, deleteFile } from '../middleware/aws.js';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to handle file upload
const uploadFile = (file, folder = '') => {
  // Create unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = path.extname(file.originalname);
  const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
  
  // Create directory if it doesn't exist
  const uploadDir = path.join(__dirname, '../uploads', folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Move file to upload directory
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, file.buffer);
  
  return path.join('uploads', folder, filename);
};

// Create Story
export const createStory = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content || !req.file) {
      return res.status(400).json({ error: 'Title, content, and image are required' });
    }
    
    const imagePath = uploadFile(req.file, "story");
    const newStory = new Story({
      title,
      content,
      image: imagePath
    });
    
    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Stories
export const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Story
export const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Story
export const updateStory = async (req, res) => {
  try {
    const { title, content } = req.body;
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    let updates = { title, content };
    
    if (req.file) {
      // Delete old image if it exists
      if (story.image) {
        const oldImagePath = path.join(__dirname, '../', story.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Upload new image
      const imagePath = uploadFile(req.file, "story");
      updates.image = imagePath;
    }
    
    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    
    res.status(200).json(updatedStory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Story
export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    // Delete associated image
    if (story.image) {
      const imagePath = path.join(__dirname, '../', story.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Story.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};