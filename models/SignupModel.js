import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const SignupSchema = new mongoose.Schema({
  // Basic Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords do not match!'
    }
  },
  
  // Personal Details
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [12, 'Age must be at least 12'],
    max: [120, 'Age must be less than 120']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  
  // Emergency Contact
  emergencyContactName: {
    type: String,
    required: [true, 'Emergency contact name is required']
  },
  emergencyContactPhone: {
    type: String,
    required: [true, 'Emergency contact phone is required']
  },
  
  // Health Metrics
  height: {
    value: {
      type: Number,
      required: [true, 'Height is required'],
      min: [100, 'Height must be at least 100cm'],
      max: [250, 'Height must be less than 250cm']
    },
    unit: {
      type: String,
      default: 'cm'
    }
  },
  weight: {
    value: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [30, 'Weight must be at least 30kg'],
      max: [300, 'Weight must be less than 300kg']
    },
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg'
    }
  },
  
  // Dietary Preferences
  foodPreference: {
    type: String,
    required: [true, 'Food preference is required'],
    enum: ['veg', 'non-veg', 'vegan', 'jain', 'keto']
  },
  dietaryRestrictions: {
    type: String,
    default: ''
  },
  allergies: {
    type: String,
    default: ''
  },
  
  // Activity Level
  activityLevel: {
    type: String,
    required: [true, 'Activity level is required'],
    enum: [
      'sedentary',
      'lightlyActive',
      'moderatelyActive',
      'veryActive',
      'extraActive'
    ]
  }
});

// Hash password before saving
SignupSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// Method to compare passwords
SignupSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const SignupModel = mongoose.model('Signup', SignupSchema);