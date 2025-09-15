// import Problem from "../models/Problem.js";
// import fs from "fs";
// import path from "path";

// export const getAllProblems = async (req, res) => {
//   const problems = await Problem.find();
//   res.json(problems);
// };

// export const createProblem = async (req, res) => {
//   try {
//     const { title, description, category } = req.body;
//     const image = req.file?.filename;

//     const newProblem = new Problem({ title, description, category, image });
//     await newProblem.save();
//     res.status(201).json(newProblem);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const updateProblem = async (req, res) => {
//   try {
//     const { title, description, category } = req.body;
//     const image = req.file?.filename;

//     const updatedFields = { title, description, category };
//     if (image) updatedFields.image = image;

//     const updated = await Problem.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const deleteProblem = async (req, res) => {
//   try {
//     const problem = await Problem.findById(req.params.id);
//     if (!problem) return res.status(404).json({ message: "Not found" });

//     // Delete image from /uploads if exists
//     if (problem.image) {
//       const imgPath = path.join(process.cwd(), "uploads", problem.image);
//       if (fs.existsSync(imgPath)) {
//         fs.unlinkSync(imgPath);
//       }
//     }

//     await Problem.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


import Problem from "../models/Problem.js";
import { uploadFile2, deleteFile } from '../middleware/aws.js'; // Import AWS functions

// Helper to process image upload to S3
const processProblemImageUpload = async (file) => {
  if (!file) {
    throw new Error('No image uploaded');
  }
  
  try {
    // Upload to AWS S3
    const imageUrl = await uploadFile2(file, "problems");
    return imageUrl;
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new Error('Failed to upload problem image to cloud storage');
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems
    });
  } catch (error) {
    console.error('Get Problems Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch problems',
      details: error.message 
    });
  }
};

export const createProblem = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    let imageUrl = '';
    if (req.file) {
      try {
        imageUrl = await processProblemImageUpload(req.file);
      } catch (uploadError) {
        console.error('Image Upload Error:', uploadError);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to upload problem image',
          details: uploadError.message 
        });
      }
    }

    const newProblem = new Problem({ 
      title, 
      description, 
      category, 
      image: imageUrl 
    });
    
    await newProblem.save();
    
    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: newProblem
    });
  } catch (error) {
    console.error('Create Problem Error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        error: 'Validation Error',
        details: errors 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ 
        success: false,
        error: 'Problem not found' 
      });
    }

    let imageUrl = problem.image;
    
    // Handle image update if new file is provided
    if (req.file) {
      try {
        // Upload new image
        imageUrl = await processProblemImageUpload(req.file);
        
        // Delete old image from S3 if it exists
        if (problem.image) {
          try {
            await deleteFile(problem.image);
          } catch (deleteError) {
            console.warn('Failed to delete old problem image from S3:', deleteError.message);
            // Continue with update even if old image deletion fails
          }
        }
      } catch (uploadError) {
        console.error('Image Upload Error:', uploadError);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to upload new problem image',
          details: uploadError.message 
        });
      }
    }

    const updatedFields = { 
      title: title || problem.title,
      description: description || problem.description,
      category: category || problem.category,
      image: imageUrl
    };

    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id, 
      updatedFields, 
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Problem updated successfully',
      data: updatedProblem
    });
  } catch (error) {
    console.error('Update Problem Error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid problem ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({ 
        success: false,
        error: 'Problem not found' 
      });
    }

    // Delete image from S3 if it exists
    if (problem.image) {
      try {
        await deleteFile(problem.image);
      } catch (deleteError) {
        console.warn('Failed to delete problem image from S3:', deleteError.message);
        // Continue with problem deletion even if image deletion fails
      }
    }

    await Problem.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully'
    });
  } catch (error) {
    console.error('Delete Problem Error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid problem ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};