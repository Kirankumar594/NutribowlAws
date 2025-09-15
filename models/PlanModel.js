import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    planType: {
      type: String,
      enum: ["weight-loss", "weight-gain", "stay-fit"],
      required: true,
    },
    duration: { type: String, required: true },
    veg1Meal: { type: String, required: true },
    veg2Meal: { type: String, required: true },
    nonVeg1Meal: { type: String, required: true },
    nonVeg2Meal: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
