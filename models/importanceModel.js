import mongoose from 'mongoose';

const importanceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  icon: {
    type: String,
    required: [true, 'Icon is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['weight-gain', 'weight-loss', 'stay-fit', 'other'],
    default: 'other'
  }
}, { timestamps: true });

export default mongoose.model('Importance', importanceSchema);