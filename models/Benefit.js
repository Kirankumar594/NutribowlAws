import mongoose from 'mongoose';

const benefitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String,
    required: [true, 'Icon path is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Text index for search functionality
benefitSchema.index({ title: 'text', description: 'text' });

const Benefit = mongoose.model('Benefit', benefitSchema);

export default Benefit;