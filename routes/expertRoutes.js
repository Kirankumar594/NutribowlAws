import express from 'express';
import multer from 'multer';
import {
  getExperts,
  getExpertById,
  createExpert,
  updateExpert,
  deleteExpert,
} from '../controllers/expertController.js';

const storage = multer.memoryStorage(); // store file in memory for S3
const UploadExpertImage = multer({  }).single("image");

const expertRoutes = express.Router();

expertRoutes.get('/', getExperts);
expertRoutes.post('/', UploadExpertImage, createExpert);
expertRoutes.put('/:id', UploadExpertImage, updateExpert);
expertRoutes.delete('/:id', deleteExpert);
expertRoutes.get('/:id', getExpertById);

export default expertRoutes;