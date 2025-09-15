import mongoose from 'mongoose';
import Category from '../models/CategoryModel.js';
import { uploadFile2, deleteFile } from '../middleware/aws.js';

// Improved nested data parser with validation
const parseNestedData = (data) => {
  if (!data) return [];
  
  try {
    // If it's already an array, return it
    if (Array.isArray(data)) return data;
    
    // If it's a string, try to parse it
    if (typeof data === 'string') {
      // If the string is empty, return empty array
      if (data.trim() === '') return [];
      
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [parsed];
    }
    
    // If it's an object, return it in an array
    return [data];
  } catch (error) {
    console.error('Parsing error:', error);
    return [];
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false,
        message: 'Category name is required' 
      });
    }

    // Handle file upload more robustly
    let imagePath = null;
    if (req.file) {
       imageUrl = await uploadFile2(req.file, "categories"); // Normalize path for Windows
    }

    // Parse features and subcategories properly
    const features = parseNestedData(req.body.features);
    const subcategories = parseNestedData(req.body.subcategories);

    const category = new Category({
      name: name.trim(),
      description: description ? description.trim() : '',
      image: imagePath,
      features: features,
      subcategories: subcategories,
    });

    const createdCategory = await category.save();
    
    res.status(201).json({
      success: true,
      data: createdCategory,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    
    let message = 'Failed to create category';
    if (error.name === 'ValidationError') {
      message = Object.values(error.errors).map(val => val.message).join(', ');
    } else if (error.code === 11000) {
      message = 'Category with this name already exists';
    }
    
    res.status(400).json({
      success: false,
      message,
    });
  }
};

// Get All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    
    if (!categories || categories.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: 'No categories found',
        data: []
      });
    }
    
    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get Single Category by ID
export const getCategoryById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }
    
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
    });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }
    
    const { name, description } = req.body;
    let updateData = {};
    
    // Only update fields that are provided
    if (name) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    
    // Handle file upload
    if (req.file) {
        imageUrl = await uploadFile2(req.file, "categories");
    }
    
    // Handle features and subcategories
    if (req.body.features) {
      updateData.features = parseNestedData(req.body.features);
    }
    
    if (req.body.subcategories) {
      updateData.subcategories = parseNestedData(req.body.subcategories);
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    
    let message = 'Failed to update category';
    if (error.name === 'ValidationError') {
      message = Object.values(error.errors).map(val => val.message).join(', ');
    } else if (error.code === 11000) {
      message = 'Category with this name already exists';
    }
    
    res.status(400).json({
      success: false,
      message,
    });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }
    
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
    });
  }
};