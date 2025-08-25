// routes/aboutRoutes.js
import express from 'express';
import {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
  uploadTeamImage,
  deleteImage,
  getAllAbout
} from '../controllers/aboutController.js';
import upload from '../middleware/upload.js'; // Your universal multer

const router = express.Router();

// Public routes
router.get('/', getAbout);

// Admin routes (add authentication middleware as needed)
router.post('/', createAbout);
router.put('/:id', updateAbout);
router.delete('/:id', deleteAbout);
router.get('/all', getAllAbout);

// Image upload routes
router.post('/upload-image', upload.single('teamImage'), uploadTeamImage);
router.delete('/delete-image/:filename', deleteImage);

export default router;