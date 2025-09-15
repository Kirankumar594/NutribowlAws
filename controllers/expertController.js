import Expert from '../models/expertModel.js';
import { uploadFile2, deleteFile } from '../middleware/aws.js'; // Corrected import path

// Get all experts
export const getExperts = async (req, res) => {
  try {
    const experts = await Expert.find({}).select('-__v').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: experts.length,
      data: experts
    });
  } catch (error) {
    console.error('Get Experts Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch experts',
      error: error.message 
    });
  }
};

// Get single expert by ID
export const getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id).select('-__v');
    
    if (!expert) {
      return res.status(404).json({ 
        success: false,
        message: 'Expert not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: expert
    });
  } catch (error) {
    console.error('Get Expert Error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid expert ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch expert',
      error: error.message 
    });
  }
};

// Create new expert
export const createExpert = async (req, res) => {
  try {
    const { name, title, bio } = req.body;

    // Validation
    if (!name || !title) {
      return res.status(400).json({ 
        success: false,
        message: 'Name and Title are required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Expert image is required' 
      });
    }

    // Upload image to S3
    let imageUrl;
    try {
      imageUrl = await uploadFile2(req.file, "experts");
console.log("url  ",imageUrl)
    } catch (uploadError) {
      console.error('Image Upload Error:', uploadError);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to upload expert image',
        error: uploadError.message 
      });
    }

    // Create expert
    const expert = new Expert({ 
      name, 
      title, 
      bio: bio || '', 
      image: imageUrl 
    });

    const createdExpert = await expert.save();
    
    res.status(201).json({
      success: true,
      message: 'Expert created successfully',
      data: createdExpert
    });
  } catch (error) {
    console.error('Create Expert Error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation Error',
        errors 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to create expert',
      error: error.message 
    });
  }
};

// Update expert
export const updateExpert = async (req, res) => {
  try {
    const { name, title, bio } = req.body;
    const expert = await Expert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({ 
        success: false,
        message: 'Expert not found' 
      });
    }

    // Update fields
    if (name) expert.name = name;
    if (title) expert.title = title;
    if (bio !== undefined) expert.bio = bio;

    // Handle image update if new file is provided
    if (req.file) {
      try {
        // Upload new image
        const newImageUrl = await uploadFile2(req.file, "experts");
        
        // Delete old image from S3 if it exists
        if (expert.image) {
          try {
            await deleteFile(expert.image);
          } catch (deleteError) {
            console.warn('Failed to delete old image:', deleteError.message);
            // Continue with update even if old image deletion fails
          }
        }
        
        expert.image = newImageUrl;
      } catch (uploadError) {
        console.error('Image Upload Error:', uploadError);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to upload new expert image',
          error: uploadError.message 
        });
      }
    }

    const updatedExpert = await expert.save();
    
    res.status(200).json({
      success: true,
      message: 'Expert updated successfully',
      data: updatedExpert
    });
  } catch (error) {
    console.error('Update Expert Error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid expert ID format' 
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation Error',
        errors 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to update expert',
      error: error.message 
    });
  }
};

// Delete expert
export const deleteExpert = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    
    if (!expert) {
      return res.status(404).json({ 
        success: false,
        message: 'Expert not found' 
      });
    }

    // Delete image from S3 if it exists
    if (expert.image) {
      try {
        await deleteFile(expert.image);
      } catch (deleteError) {
        console.warn('Failed to delete expert image from S3:', deleteError.message);
        // Continue with expert deletion even if image deletion fails
      }
    }

    await Expert.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Expert deleted successfully'
    });
  } catch (error) {
    console.error('Delete Expert Error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid expert ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete expert',
      error: error.message 
    });
  }
};