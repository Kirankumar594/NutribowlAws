import Facilities from '../models/FacilitiesModel.js';
import fs from 'fs';
import path from 'path';
import { uploadFile2, deleteFile } from '../middleware/aws.js';

// Create Facility
export const createFacility = async (req, res) => {
  try {
    const { title, description, features } = req.body;
    const image = await uploadFile2(req.file, "facilities");

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Convert features string to array (if sent as comma-separated)
    const featuresArray = Array.isArray(features) ? features : features.split(',').map(f => f.trim());

    const newFacility = new Facilities({
      title,
      description,
      features: featuresArray,
      image,
    });

    const savedFacility = await newFacility.save();
    res.status(201).json(savedFacility);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Facilities
export const getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facilities.find().sort({ createdAt: -1 });
    res.json(facilities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Facility
export const getFacilityById = async (req, res) => {
  try {
    const facility = await Facilities.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    res.json(facility);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Facility
export const updateFacility = async (req, res) => {
  try {
    const { title, description, features } = req.body;
    const facility = await Facilities.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    let image = facility.image;
    if (req.file) {
      image = await uploadFile2(req.file, "facilities");
    }

    // Convert features string to array if needed
    const featuresArray = Array.isArray(features) ? features : features.split(',').map(f => f.trim());

    const updatedFacility = await Facilities.findByIdAndUpdate(
      req.params.id,
      { title, description, features: featuresArray, image },
      { new: true }
    );

    res.json(updatedFacility);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Facility
export const deleteFacility = async (req, res) => {
  try {
    const facility = await Facilities.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    // Delete associated image
    if (facility.image) {
      const imagePath = path.join('uploads', facility.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Facilities.findByIdAndDelete(req.params.id);
    res.json({ message: 'Facility deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};