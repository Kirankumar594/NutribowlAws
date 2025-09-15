import mongoose from "mongoose";
import About from "../models/About.js";
import multer from "multer";
import path from "path";
import fs from "fs";
<<<<<<< HEAD
import { uploadFile2, deleteFile } from '../middleware/aws.js';
=======
>>>>>>> 15a42781daf0d788d16fb5bb55499b38eb5dca40

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'public/uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const upload = multer({ storage: storage });

// Get All
export const getAbouts = async (req, res) => {
  try {
    const abouts = await About.find();
    res.json(abouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
export const getAboutById = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) return res.status(404).json({ message: "Not found" });
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete whole about
export const deleteAbout = async (req, res) => {
  try {
    await About.findByIdAndDelete(req.params.id);
    res.json({ message: "About deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create About
export const createAbout = async (req, res) => {
  try {
    const { mainTitle, contentParagraphs, keyFeatures, teamMembers } = req.body;
    
    if (!mainTitle) {
      return res.status(400).json({ error: 'Main title is required' });
    }

    // Parse JSON strings if they were sent as strings
    const parsedContentParagraphs = typeof contentParagraphs === 'string' 
      ? JSON.parse(contentParagraphs) 
      : contentParagraphs;
    
    const parsedKeyFeatures = typeof keyFeatures === 'string'
      ? JSON.parse(keyFeatures)
      : keyFeatures;
    
    const parsedTeamMembers = typeof teamMembers === 'string'
      ? JSON.parse(teamMembers)
      : teamMembers;

    // Handle image for team members
    const teamMembersWithImages = parsedTeamMembers.map((member, index) => {
      if (req.files && req.files[`teamMemberImage${index}`]) {
        return {
          ...member,
          image: req.files[`teamMemberImage${index}`][0].filename
        };
      }
      return member;
    });

    const newAbout = new About({
      mainTitle,
      contentParagraphs: parsedContentParagraphs,
      keyFeatures: parsedKeyFeatures,
      teamMembers: teamMembersWithImages
    });

    const savedAbout = await newAbout.save();
    res.status(201).json(savedAbout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Update About
export const updateAbout = async (req, res) => {
  try {
    const { mainTitle, contentParagraphs, keyFeatures, teamMembers } = req.body;
    
    // Parse JSON strings if they were sent as strings
    const parsedContentParagraphs = typeof contentParagraphs === 'string' 
      ? JSON.parse(contentParagraphs) 
      : contentParagraphs;
    
    const parsedKeyFeatures = typeof keyFeatures === 'string'
      ? JSON.parse(keyFeatures)
      : keyFeatures;
    
    const parsedTeamMembers = typeof teamMembers === 'string'
      ? JSON.parse(teamMembers)
      : teamMembers;

    // Handle image for team members
    const teamMembersWithImages = parsedTeamMembers.map((member, index) => {
      if (req.files && req.files[`teamMemberImage${index}`]) {
        return {
          ...member,
          image: req.files[`teamMemberImage${index}`][0].filename
        };
      }
      return member;
    });

    const updatedAbout = await About.findByIdAndUpdate(
      req.params.id,
      {
        mainTitle,
        contentParagraphs: parsedContentParagraphs,
        keyFeatures: parsedKeyFeatures,
        teamMembers: teamMembersWithImages
      },
      { new: true }
    );

    if (!updatedAbout) {
      return res.status(404).json({ error: 'About not found' });
    }

    res.json(updatedAbout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Upload image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    res.json({
      success: true,
      data: {
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join('public/uploads', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: "Image deleted" });
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};