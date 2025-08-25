import mongoose from "mongoose";

const missionVisionSchema = new mongoose.Schema({
  title: String,
  description: String,
});

export default mongoose.model("MissionVision", missionVisionSchema);
