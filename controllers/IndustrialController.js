import Industrial from '../models/IndustrialModel.js';
import fs from 'fs';
import path from 'path';
import { uploadFile2, deleteFile } from '../middleware/aws.js';

// Create Industrial
export const createIndustrial = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }
        const image =  await uploadFile2(req.file, "industrial");
        const industrial = new Industrial({
            title,
            description,
            image
        });

        await industrial.save();
        res.status(201).json(industrial);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Industrials
export const getAllIndustrials = async (req, res) => {
    try {
        const industrials = await Industrial.find().sort({ createdAt: -1 });
        res.status(200).json(industrials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Industrial
export const getIndustrial = async (req, res) => {
    try {
        const industrial = await Industrial.findById(req.params.id);
        if (!industrial) {
            return res.status(404).json({ error: 'Industrial not found' });
        }
        res.status(200).json(industrial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Industrial
export const updateIndustrial = async (req, res) => {
    try {
        const { title, description } = req.body;
        const updates = { title, description };

        if (req.file) {
            // Delete old image if new one is uploaded
            const industrial = await Industrial.findById(req.params.id);
            if (industrial?.image) {
                fs.unlinkSync(industrial.image);
            }
            updates.image = await uploadFile2(req.file, "industrial");
        }

        const updatedIndustrial = await Industrial.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        if (!updatedIndustrial) {
            return res.status(404).json({ error: 'Industrial not found' });
        }

        res.status(200).json(updatedIndustrial);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Industrial
export const deleteIndustrial = async (req, res) => {
    try {
        const industrial = await Industrial.findByIdAndDelete(req.params.id);

        if (!industrial) {
            return res.status(404).json({ error: 'Industrial not found' });
        }

        // Delete associated image
        if (industrial.image) {
            fs.unlinkSync(industrial.image);
        }

        res.status(200).json({ message: 'Industrial deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};