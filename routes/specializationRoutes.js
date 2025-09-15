import express from 'express';
import {
  createSpecialization,
  getSpecializations,
  updateSpecialization,
  deleteSpecialization
} from '../controllers/specializationcontroller.js';
// import upload from '../middleware/upload.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

// Create specialization (with image upload)
router.post('/', upload.single('icon'), createSpecialization);

// Get all specializations
router.get('/', getSpecializations);

// Update specialization (with optional image upload)
router.put('/:id', upload.single('icon'), updateSpecialization);

// Delete specialization
router.delete('/:id', deleteSpecialization);

export default router;