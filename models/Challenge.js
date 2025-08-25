import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    title: String,
    description: String
  },
  { timestamps: true }
);

export default mongoose.model("Challenge", challengeSchema);
