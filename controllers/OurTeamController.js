import OurTeam from '../models/OurTeamModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Team Member
export const createTeamMember = async (req, res) => {
  try {
    const { name, position, description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const newTeamMember = new OurTeam({
      name,
      position,
      description,
      image,
    });

    const savedMember = await newTeamMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAllTeamMembers = async (req, res) => {
  try {
    const members = await OurTeam.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getTeamMemberById = async (req, res) => {
  try {
    const member = await OurTeam.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateTeamMember = async (req, res) => {
  try {
    const { name, position, description } = req.body;
    const member = await OurTeam.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    let image = member.image;
    if (req.file) {
      if (member.image) {
        const imagePath = path.join(__dirname, '../uploads', member.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      image = req.file.filename;
    }

    const updatedMember = await OurTeam.findByIdAndUpdate(
      req.params.id,
      { name, position, description, image },
      { new: true }
    );

    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteTeamMember = async (req, res) => {
  try {
    const member = await OurTeam.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    if (member.image) {
      const imagePath = path.join(__dirname, '../uploads', member.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await OurTeam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};