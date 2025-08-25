import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  feedback: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 5 },
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
