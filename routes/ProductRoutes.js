import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/ProductController.js';
// import upload from '../middleware/upload.js';
import { uploadProductImages } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', uploadProductImages, createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', uploadProductImages, updateProduct);
router.delete('/:id', deleteProduct);

export default router;