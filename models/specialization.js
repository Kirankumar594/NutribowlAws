import mongoose from 'mongoose';

const specializationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    items: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Specialization = mongoose.model('Specialization', specializationSchema);
export default Specialization;