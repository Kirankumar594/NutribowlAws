import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

adminSchema.statics.createInitialAdmin = async function() {
  try {
    const existingAdmin = await this.findOne({ username: 'admin@gmail.com' });
    if (!existingAdmin) {
      const admin = new this({
        username: 'admin@gmail.com',
        password: 'admin@123' 
      });
      await admin.save();
      console.log('Initial admin created successfully');
    }
  } catch (error) {
    console.error('Error creating initial admin:', error);
  }
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;