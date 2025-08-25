import express from 'express';
import {
  getAllImportanceItems,
  createImportanceItem,
  updateImportanceItem,
  deleteImportanceItem
} from '../controllers/importanceController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllImportanceItems);
router.post('/', upload.single('icon'), createImportanceItem);
router.put('/:id', upload.single('icon'), updateImportanceItem);
router.delete('/:id', deleteImportanceItem);

export default router;