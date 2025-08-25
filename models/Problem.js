import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  category: String, // e.g., "weight-gain", "weight-loss", "fitness"
});

export default mongoose.model('Problem', problemSchema);
