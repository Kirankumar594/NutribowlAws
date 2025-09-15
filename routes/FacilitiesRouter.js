import express from 'express';
import {
  createFacility,
  getAllFacilities,
  getFacilityById,
  updateFacility,
  deleteFacility,
} from '../controllers/FacilitiesController.js';
import multer from 'multer';

const router = express.Router();

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post('/', upload.single('image'), createFacility);
router.get('/', getAllFacilities);
router.get('/:id', getFacilityById);
router.put('/:id', upload.single('image'), updateFacility);
router.delete('/:id', deleteFacility);

export default router;