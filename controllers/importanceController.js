import Importance from "../models/importanceModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

    const newItem = new Importance({ 
      title, 
      description, 
      icon: req.file.filename, 
      category 
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads', req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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
      // Delete old icon if exists
      if (item.icon) {
        const oldIconPath = path.join(__dirname, '../../uploads', item.icon);
        if (fs.existsSync(oldIconPath)) fs.unlinkSync(oldIconPath);
      }
      updateData.icon = req.file.filename;
    }

    const updatedItem = await Importance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedItem);
  } catch (err) {
    // Clean up newly uploaded file if error occurs
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads', req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.status(500).json({ error: err.message });
  }
};

export const deleteImportanceItem = async (req, res) => {
  try {
    const item = await Importance.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: "Importance item not found" });
    }

    // Delete icon file if exists
    if (item.icon) {
      const iconPath = path.join(__dirname, '../../uploads', item.icon);
      if (fs.existsSync(iconPath)) fs.unlinkSync(iconPath);
    }

    await Importance.findByIdAndDelete(req.params.id);
    res.json({ message: "Importance item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};