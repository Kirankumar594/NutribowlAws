import express from 'express';
import {
  createMenuItem,
  getAllMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleItemStatus,
  getMenuAnalytics
} from '../controllers/menuController.js';
// import upload from '../middleware/upload.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

// Create a new menu item
router.post('/', upload.single('image'), createMenuItem);

// Get all menu items
router.get('/', getAllMenuItems);

// Get menu analytics
router.get('/analytics', getMenuAnalytics);

// Get single menu item
router.get('/:id', getMenuItem);

// Update menu item
router.put('/:id', upload.single('image'), updateMenuItem);

// Delete menu item
router.delete('/:id', deleteMenuItem);

// Toggle item status
router.patch('/:id/toggle-status', toggleItemStatus);

export default router;