import express from 'express';
import {
  createStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
} from '../controllers/StoryController.js';
// import upload from '../middleware/upload.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

// CRUD Routes for Story
router.post('/', upload.single('image'), createStory);
router.get('/', getAllStories);
router.get('/:id', getStoryById);
router.put('/:id', upload.single('image'), updateStory);
router.delete('/:id', deleteStory);

export default router;