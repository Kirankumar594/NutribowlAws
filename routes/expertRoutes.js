import express from 'express';
import {
  getExperts,
  getExpertById,
  createExpert,
  updateExpert,
  deleteExpert,
} from '../controllers/expertController.js';
import upload from '../middleware/upload.js';


const router = express.Router();

router.route('/')
  .get(getExperts)
  .post( upload.single('image'), createExpert);

router.route('/:id')
  .put( upload.single('image'), updateExpert)
  .delete( deleteExpert).get(getExpertById);

export default router;