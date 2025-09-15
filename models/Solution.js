import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  icon: {
    type: String,
    required: true,
    enum: ['check-circle', 'calendar', 'utensils', 'clipboard-list'] // only allowed values
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Solution = mongoose.model('Solution', solutionSchema);

export default Solution;