import mongoose from 'mongoose';

const MealItemSchema = new mongoose.Schema({
  Course: String,
  Item: String,
  Calories: String,
  Protein: String,
  Carbs: String,
  Fat: String,
  Ingredients: String,
  Benefits: String
}, { _id: false });

const MealSchema = new mongoose.Schema({
  Lunch: [MealItemSchema],
  Dinner: [MealItemSchema]
}, { _id: false });

const DayMealPlanSchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true },
  vegMeal: MealSchema,
  nonVegMeal: MealSchema
});

const MealPlan = mongoose.model('MealPlan', DayMealPlanSchema);
export default MealPlan;