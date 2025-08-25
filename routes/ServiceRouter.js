import express from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/ServiceController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Routes
router.post('/', upload.single('mainImage'), createService);
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.put('/:id', upload.single('mainImage'), updateService);
router.delete('/:id', deleteService);

export default router;