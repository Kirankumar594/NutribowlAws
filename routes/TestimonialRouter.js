import express from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../';
// import upload from '../middleware/upload.js';
import multer from 'multer';


const upload = multer();
const router = express.Router();

router.route('/')
  .get(getTestimonials)
  .post(protect, admin, upload.single('image'), createTestimonial);

router.route('/:id')
  .put(protect, admin, upload.single('image'), updateTestimonial)
  .delete(protect, admin, deleteTestimonial);

export default router;