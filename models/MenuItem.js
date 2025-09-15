// import mongoose from 'mongoose';

// const menuItemSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   calories: { type: Number, required: true },
//   protein: { type: Number, required: true },
//   carbs: { type: Number, required: true },
//   fat: { type: Number, required: true },
//   ingredients: { type: [String], required: true },
// category: { 
//   type: String, 
//   required: true,
//   enum: [
//     'salad', 'bowls', 'wraps', 'sandwich', 'cheat meals', 
//     'burger', 'pizza', 'detox', 'non-veg', 'veg', 'Starters and Sides','Smoothies'
//   ]
// },
//   dietType: { 
//     type: [String], 
//     required: true,
//     enum: ['veg', 'non-veg', 'vegan', 'keto']
//   },
//   image: { type: String, required: true },
//   allergens: { type: [String], default: [] },
//   planType: { 
//     type: [String], 
//     required: true,
//     enum: ['weight-gain', 'stay-fit', 'weight-loss']
//   },
//   isActive: { type: Boolean, default: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// export default MenuItem;



import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }, // optional
  price: { type: Number, required: true },
  calories: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  protein: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  carbs: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  fat: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  ingredients: { type: [String]},
  category: { 
    type: String, 
    required: true,
    enum: [
  'salad', 'bowls', 'wraps', 'sandwich', 'cheat meals', 
<<<<<<< HEAD
  'burger', 'pizza', 'detox',  'Starters and Sides','Smoothies'
=======
  'burger', 'pizza', 'detox', 'non-veg', 'veg', 'Starters and Sides','Smoothies',"desserts"
>>>>>>> 15a42781daf0d788d16fb5bb55499b38eb5dca40
]
  },
  dietType: { 
    type: [String], 
    required: true,
    enum: ['veg', 'non-veg', 'vegan', 'keto']
  },
  image: { type: String, required: true },
  allergens: { type: [String] },
  planType: { 
    type: [String], 
    required: true,
    enum: ['weight-gain', 'stay-fit', 'weight-loss']
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
