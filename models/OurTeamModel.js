import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const OurTeam = mongoose.model('OurTeam', teamMemberSchema);

export default OurTeam;