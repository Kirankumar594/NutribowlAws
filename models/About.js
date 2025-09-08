// // models/About.js
// import mongoose from 'mongoose';

// const teamMemberSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   role: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   image: {
//     type: String,
//     default: ''
//   },
//   imageFileName: {
//     type: String,
//     default: ''
//   }
// }, { _id: true });

// const aboutSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 200
//   },
//   paragraphs: [{
//     type: String,
//     required: true,
//     trim: true
//   }],
//   bulletPoints: [{
//     type: String,
//     required: true,
//     trim: true
//   }],
//   teamMembers: [teamMemberSchema],
//   buttonText: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 50
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Update the updatedAt field before saving
// aboutSchema.pre('save', function(next) {
//   this.updatedAt = new Date();
//   next();
// });

// // Update the updatedAt field before updating
// aboutSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
//   this.set({ updatedAt: new Date() });
//   next();
// });

// export default mongoose.model('About', aboutSchema);



import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  mainTitle: {
    type: String,
    required: true,
  },
  contentParagraphs: [
    {
      title: { type: String, required: true },
    },
  ],
  keyFeatures: [
    {
      point: { type: String, required: true },
    },
  ],
  teamMembers: [
    {
      name: { type: String, required: true },
      role: { type: String, required: true },
      image: { type: String }, // image URL or path
    },
  ],
});

export default mongoose.model("About", aboutSchema);
