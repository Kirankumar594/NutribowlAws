// routes/missionVision.js
import express from 'express';
import MissionVision from '../models/MissionVision.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const data = await MissionVision.find();
  res.json(data);
});

router.post('/', async (req, res) => {
  const newEntry = new MissionVision(req.body);
  await newEntry.save();
  res.json(newEntry);
});

router.put('/:id', async (req, res) => {
  const updated = await MissionVision.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await MissionVision.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
