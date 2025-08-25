import Story from '../models/StoryModel.js';
import fs from 'fs';
import path from 'path';

// Create Story
export const createStory = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content || !req.file) {
      return res.status(400).json({ error: 'Title, content, and image are required' });
    }
    const newStory = new Story({
      title,
      content,
      image: req.file.filename,
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
        const imagePath = path.join('uploads', story.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      updates.image = req.file.filename;
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
      const imagePath = path.join('uploads', story.image);
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