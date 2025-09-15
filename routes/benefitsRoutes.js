import express from 'express';
import {
  getBenefits,
  createBenefit,
  updateBenefit,
  deleteBenefit
} from '../controllers/benefitsController.js';
// import upload from '../middleware/upload.js';
import multer from 'multer';


const upload = multer();
const router = express.Router();

router.route('/')
  .get(getBenefits)
  .post(upload.single('icon'), createBenefit);

router.route('/:id')
  .put(upload.single('icon'), updateBenefit)
  .delete(deleteBenefit);

export default router;