import Importance from "../models/importanceModel.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { uploadFile2, deleteFile } from '../middleware/aws.js';

export const getAllImportanceItems = async (req, res) => {
  try {
    const items = await Importance.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createImportanceItem = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "Icon image is required" });
    }

    // Upload file to AWS S3
    const awsFile = await uploadFile2(req.file, "importance");
    if (!awsFile || !awsFile.Location) {
      return res.status(500).json({ error: "Failed to upload icon to cloud storage" });
    }

    const newItem = new Importance({ 
      title, 
      description, 
      icon: awsFile.Location, // Store the S3 URL instead of filename
      iconKey: awsFile.Key, // Store the S3 key for future deletion
      category 
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    // Clean up uploaded file if error occurs
    if (req.file && req.file.buffer) {
      // If using multer-memory storage, no need to delete local file
      // If using disk storage, you might need to delete the temp file
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: Object.values(err.errors).map(e => e.message).join(', ') 
      });
    }
    res.status(500).json({ error: err.message });
  }
};

export const updateImportanceItem = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const item = await Importance.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Importance item not found" });
    }

    const updateData = { title, description, category };
    
    if (req.file) {
      // Upload new file to AWS S3
      const awsFile = await uploadFile2(req.file, "importance");
      if (!awsFile || !awsFile.Location) {
        return res.status(500).json({ error: "Failed to upload new icon to cloud storage" });
      }

      // Delete old icon from AWS S3 if exists
      if (item.iconKey) {
        try {
          await deleteFile(item.iconKey);
        } catch (deleteError) {
          console.error("Error deleting old icon from S3:", deleteError);
          // Continue with update even if deletion fails
        }
      }

      updateData.icon = awsFile.Location;
      updateData.iconKey = awsFile.Key;
    }

    const updatedItem = await Importance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteImportanceItem = async (req, res) => {
  try {
    const item = await Importance.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: "Importance item not found" });
    }

    // Delete icon file from AWS S3 if exists
    if (item.iconKey) {
      try {
        await deleteFile(item.iconKey);
      } catch (deleteError) {
        console.error("Error deleting icon from S3:", deleteError);
        // Continue with deletion even if file deletion fails
      }
    }

    await Importance.findByIdAndDelete(req.params.id);
    res.json({ message: "Importance item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};