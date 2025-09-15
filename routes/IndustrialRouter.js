import express from 'express';
import { 
    createIndustrial, 
    getAllIndustrials, 
    getIndustrial, 
    updateIndustrial, 
    deleteIndustrial 
} from '../controllers/IndustrialController.js';
// import upload from '../middleware/upload.js';
import multer from 'multer';

const upload = multer();
const router = express.Router();

// CRUD Routes for Industrial
router.post('/', upload.single('image'), createIndustrial);
router.get('/', getAllIndustrials);
router.get('/:id', getIndustrial);
router.put('/:id', upload.single('image'), updateIndustrial);
router.delete('/:id', deleteIndustrial);

export default router;