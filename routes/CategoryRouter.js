import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/CategoryController.js';
// import upload from '../middleware/upload.js';
import multer from "multer"

const upload  = multer();
const router = express.Router();

router.route('/')
  .post(upload.single('image'), createCategory)
  .get(getCategories);

router.route('/:id')
  .get(getCategoryById)
  .put(upload.single('image'), updateCategory)
  .delete(deleteCategory);

export default router;