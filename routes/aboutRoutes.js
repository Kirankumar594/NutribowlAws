import express from "express";
import {
  createAbout,
  getAbouts,
  getAboutById,
  updateAbout,
  deleteAbout,
  uploadImage,
  deleteImage
} from "../controllers/aboutController.js";
import upload  from "../middleware/upload.js";

const router = express.Router();

// Full CRUD for About
router.post("/", upload.any(), createAbout);
router.get("/", getAbouts);
router.get("/:id", getAboutById);
router.put("/:id", upload.any(), updateAbout);
router.delete("/:id", deleteAbout);

// Image routes
router.post("/upload-image", upload.single('image'), uploadImage);
router.delete("/delete-image/:filename", deleteImage);

export default router;