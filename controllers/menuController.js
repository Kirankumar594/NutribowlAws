import MenuItem from '../models/MenuItem.js';
import upload from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

// Helper to process image upload
const processImageUpload = (req) => {
  if (!req.file) {
    throw new Error('No image uploaded');
  }
  
  // In production, you would upload to cloud storage (S3, Cloudinary, etc.)
  // Here we'll just return the local path
  return /uploads/${req.file.filename};
};


export const createMenuItem = async (req, res) => {
  try {
    let imagePath = '';
    if (req.file) {
      imagePath = processImageUpload(req);
    }

    // Ensure arrays are correctly formatted
    const ingredients = typeof req.body.ingredients === 'string'
      ? req.body.ingredients.split(',').map(item => item.trim())
      : Array.isArray(req.body.ingredients) ? req.body.ingredients : [];

    const allergens = typeof req.body.allergens === 'string'
      ? req.body.allergens.split(',').map(item => item.trim())
      : Array.isArray(req.body.allergens) ? req.body.allergens : [];

    const dietType = typeof req.body.dietType === 'string'
      ? req.body.dietType.split(',').map(item => item.trim())
      : Array.isArray(req.body.dietType) ? req.body.dietType : [];

    const planType = typeof req.body.planType === 'string'
      ? req.body.planType.split(',').map(item => item.trim())
      : Array.isArray(req.body.planType) ? req.body.planType : [];

    // Parse numeric values - use 0 if empty/undefined
    const price = req.body.price !== undefined ? parseFloat(req.body.price) || 0 : 0;
    const calories = req.body.calories !== undefined ? parseFloat(req.body.calories) || 0 : 0;
    const protein = req.body.protein !== undefined ? parseFloat(req.body.protein) || 0 : 0;
    const carbs = req.body.carbs !== undefined ? parseFloat(req.body.carbs) || 0 : 0;
    const fat = req.body.fat !== undefined ? parseFloat(req.body.fat) || 0 : 0;

    const newItem = new MenuItem({
      name: req.body.name,
      description: req.body.description,
      price: price,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      category: req.body.category,
      dietType,
      planType,
      image: imagePath,
      ingredients,
      allergens,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    const { search, category } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const items = await MenuItem.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single menu item
export const getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const updateMenuItem = async (req, res) => {

//   try {
//     const item = await MenuItem.findById(req.params.id);
//     if (!item) {
//       return res.status(404).json({ message: 'Menu item not found' });
//     }

//     let imagePath = item.image;
    
//     if (req.file) {
//       // Delete old image if exists
//       if (item.image && item.image.startsWith('/uploads/')) {
//         const oldImagePath = path.join(__dirname, '..', item.image);
//         if (fs.existsSync(oldImagePath)) {
//           fs.unlinkSync(oldImagePath);
//         }
//       }
//       imagePath = processImageUpload(req);
//     }

//     // Safely handle ingredients and allergens
//     const ingredients = req.body.ingredients 
//       ? req.body.ingredients.split(',').map(item => item.trim())
//       : item.ingredients; // Fall back to existing value if not provided
      
//     const allergens = req.body.allergens 
//       ? req.body.allergens.split(',').map(item => item.trim()).filter(Boolean)
//       : item.allergens; // Fall back to existing value if not provided

//     const updatedData = {
//       ...req.body,
//       image: imagePath,
//       ingredients,
//       allergens
//     };

//     const updatedItem = await MenuItem.findByIdAndUpdate(
//       req.params.id,
//       updatedData,
//       { new: true }
//     );

//     res.json(updatedItem);
//   } catch (error) {
//     res.status(400).json({ 
//       message: error.message,
//       details: "Check if ingredients/allergens are provided correctly"
//     });
//   }
// };



// Update your updateMenu controller
export const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, calories, protein, carbs, fat, category, isActive } = req.body;

    let ingredients = req.body.ingredients;
    if (typeof ingredients === 'string') {
      ingredients = ingredients.split(',').map(item => item.trim());
    } else if (!Array.isArray(ingredients)) {
      ingredients = [];
    }

    let allergens = req.body.allergens;
    if (typeof allergens === 'string') {
      allergens = allergens.split(',').map(item => item.trim()).filter(Boolean);
    } else if (!Array.isArray(allergens)) {
      allergens = [];
    }

    const dietType = Array.isArray(req.body.dietType) ? req.body.dietType : [];
    const planType = Array.isArray(req.body.planType) ? req.body.planType : [];

    // Parse numeric values - use 0 if empty/undefined
    const parsedPrice = price !== undefined ? parseFloat(price) || 0 : undefined;
    const parsedCalories = calories !== undefined ? parseFloat(calories) || 0 : undefined;
    const parsedProtein = protein !== undefined ? parseFloat(protein) || 0 : undefined;
    const parsedCarbs = carbs !== undefined ? parseFloat(carbs) || 0 : undefined;
    const parsedFat = fat !== undefined ? parseFloat(fat) || 0 : undefined;

    const updateData = {
      name,
      description,
      ingredients,
      allergens,
      category,
      dietType,
      planType,
      isActive
    };

    // Only include numeric fields if they were provided
    if (price !== undefined) updateData.price = parsedPrice;
    if (calories !== undefined) updateData.calories = parsedCalories;
    if (protein !== undefined) updateData.protein = parsedProtein;
    if (carbs !== undefined) updateData.carbs = parsedCarbs;
    if (fat !== undefined) updateData.fat = parsedFat;

    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};




// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Delete associated image
    if (item.image && item.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', item.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle item status
export const toggleItemStatus = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    item.isActive = !item.isActive;
    await item.save();
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get menu analytics
export const getMenuAnalytics = async (req, res) => {
  try {
    const totalItems = await MenuItem.countDocuments();
    const activeItems = await MenuItem.countDocuments({ isActive: true });
    
    const avgPriceResult = await MenuItem.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: "$price" }
        }
      }
    ]);
    
    const avgPrice = avgPriceResult[0]?.avgPrice || 0;
    
    const vegItems = await MenuItem.countDocuments({ dietType: 'veg' });
    
    const categoryDistribution = await MenuItem.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      totalItems,
      activeItems,
      avgPrice: Math.round(avgPrice),
      vegItems,
      categoryDistribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
