import express from "express";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/TestimonialController.js";
// import upload from "../middleware/upload.js";
import multer from "multer";

const upload  = multer();
const router = express.Router();

router.get("/", getTestimonials);
router.post("/", upload.single("image"), createTestimonial);
router.put("/:id", upload.single("image"), updateTestimonial);
router.delete("/:id", deleteTestimonial);

export default router;
