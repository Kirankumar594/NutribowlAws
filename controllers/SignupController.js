import jwt from 'jsonwebtoken';
import { SignupModel } from '../models/SignupModel.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'  // token expires in 7 days
  });
};

export const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      gender,
      age,
      address,
      emergencyContactName,
      emergencyContactPhone,
      height,
      weight,
      foodPreference,
      dietaryRestrictions,
      allergies,
      activityLevel
    } = req.body;

    // Check if user already exists
    const existingUser = await SignupModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already in use'
      });
    }

    // Create new user with all fields
    const newUser = await SignupModel.create({
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      gender,
      age,
      address,
      emergencyContactName,
      emergencyContactPhone,
      height: {
        value: height.value,
        unit: height.unit || 'cm' // default to cm if not specified
      },
      weight: {
        value: weight.value,
        unit: weight.unit || 'kg' // default to kg if not specified
      },
      foodPreference,
      dietaryRestrictions: dietaryRestrictions || '',
      allergies: allergies || '',
      activityLevel
    });

    // Create token
    const token = signToken(newUser._id);

    // Remove sensitive data from output
    newUser.password = undefined;
    newUser.confirmPassword = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists and password is correct
    const user = await SignupModel.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // Create token
    const token = signToken(user._id);

    // Remove sensitive data from output
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Add these to your existing authController.js

// Get current user's profile (simple version)
export const getMyProfile = async (req, res) => {
  try {
    // 1. Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user (excluding passwords)
    const user = await SignupModel.findById(decoded.id)
      .select('-password -confirmPassword');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 4. Return user data
    res.json({
      success: true,
      data: user
    });

  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to get profile',
      details: err.message 
    });
  }
};

// Update profile (simple version)
export const updateMyProfile = async (req, res) => {
  try {
    // 1. Get token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // 2. Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Prepare update data
    const updateData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      height: {
        value: req.body.height,
        unit: req.body.heightUnit || 'cm'
      },
      weight: {
        value: req.body.weight,
        unit: req.body.weightUnit || 'kg'
      },
      foodPreference: req.body.foodPreference
    };

    // 4. Update user
    const updatedUser = await SignupModel.findByIdAndUpdate(
      decoded.id,
      updateData,
      { new: true } // Return updated document
    ).select('-password -confirmPassword');

    res.json({
      success: true,
      data: updatedUser
    });

  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to update profile',
      details: err.message 
    });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    // In a real application, you would verify admin privileges here
    // For now, we'll just return all users
    
    const users = await SignupModel.find()
      .select('-password -confirmPassword') // Exclude sensitive data
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users',
      details: err.message
    });
  }
};

// Get user by ID (admin function)
export const getUserById = async (req, res) => {
  try {
    const user = await SignupModel.findById(req.params.id)
      .select('-password -confirmPassword'); // Exclude sensitive data

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user',
      details: err.message
    });
  }
};