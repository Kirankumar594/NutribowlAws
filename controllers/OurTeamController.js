// import OurTeam from '../models/OurTeamModel.js';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Create Team Member
// export const createTeamMember = async (req, res) => {
//   try {
//     const { name, position, description } = req.body;
//     const image = req.file ? req.file.filename : null;

//     if (!image) {
//       return res.status(400).json({ error: 'Image is required' });
//     }

//     const newTeamMember = new OurTeam({
//       name,
//       position,
//       description,
//       image,
//     });

//     const savedMember = await newTeamMember.save();
//     res.status(201).json(savedMember);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getAllTeamMembers = async (req, res) => {
//   try {
//     const members = await OurTeam.find().sort({ createdAt: -1 });
//     res.json(members);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getTeamMemberById = async (req, res) => {
//   try {
//     const member = await OurTeam.findById(req.params.id);
//     if (!member) {
//       return res.status(404).json({ error: 'Team member not found' });
//     }
//     res.json(member);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const updateTeamMember = async (req, res) => {
//   try {
//     const { name, position, description } = req.body;
//     const member = await OurTeam.findById(req.params.id);

//     if (!member) {
//       return res.status(404).json({ error: 'Team member not found' });
//     }

//     let image = member.image;
//     if (req.file) {
//       if (member.image) {
//         const imagePath = path.join(__dirname, '../uploads', member.image);
//         if (fs.existsSync(imagePath)) {
//           fs.unlinkSync(imagePath);
//         }
//       }
//       image = req.file.filename;
//     }

//     const updatedMember = await OurTeam.findByIdAndUpdate(
//       req.params.id,
//       { name, position, description, image },
//       { new: true }
//     );

//     res.json(updatedMember);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const deleteTeamMember = async (req, res) => {
//   try {
//     const member = await OurTeam.findById(req.params.id);
//     if (!member) {
//       return res.status(404).json({ error: 'Team member not found' });
//     }
//     if (member.image) {
//       const imagePath = path.join(__dirname, '../uploads', member.image);
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//       }
//     }

//     await OurTeam.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Team member deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



import OurTeam from '../models/OurTeamModel.js';
import { uploadFile2, deleteFile } from '../middleware/aws.js'; // Import AWS functions

// Helper to process image upload to S3
const processTeamImageUpload = async (file) => {
  if (!file) {
    throw new Error('No image uploaded');
  }
  
  try {
    // Upload to AWS S3
    const imageUrl = await uploadFile2(file, "team-members");
    return imageUrl;
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new Error('Failed to upload team member image to cloud storage');
  }
};

// Create Team Member
export const createTeamMember = async (req, res) => {
  try {
    const { name, position, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Team member image is required' 
      });
    }

    let imageUrl;
    try {
      imageUrl = await processTeamImageUpload(req.file);
    } catch (uploadError) {
      console.error('Image Upload Error:', uploadError);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to upload team member image',
        details: uploadError.message 
      });
    }

    const newTeamMember = new OurTeam({
      name,
      position,
      description,
      image: imageUrl, // S3 URL instead of local filename
    });

    const savedMember = await newTeamMember.save();
    
    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: savedMember
    });
  } catch (error) {
    console.error('Create Team Member Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Get all team members
export const getAllTeamMembers = async (req, res) => {
  try {
    const members = await OurTeam.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    console.error('Get Team Members Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch team members',
      details: error.message 
    });
  }
};

// Get single team member by ID
export const getTeamMemberById = async (req, res) => {
  try {
    const member = await OurTeam.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ 
        success: false,
        error: 'Team member not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Get Team Member Error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid team member ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch team member',
      details: error.message 
    });
  }
};

// Update team member
export const updateTeamMember = async (req, res) => {
  try {
    const { name, position, description } = req.body;
    const member = await OurTeam.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ 
        success: false,
        error: 'Team member not found' 
      });
    }

    let imageUrl = member.image;
    
    // Handle image update if new file is provided
    if (req.file) {
      try {
        // Upload new image
        imageUrl = await processTeamImageUpload(req.file);
        
        // Delete old image from S3 if it exists
        if (member.image) {
          try {
            await deleteFile(member.image);
          } catch (deleteError) {
            console.warn('Failed to delete old team member image from S3:', deleteError.message);
            // Continue with update even if old image deletion fails
          }
        }
      } catch (uploadError) {
        console.error('Image Upload Error:', uploadError);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to upload new team member image',
          details: uploadError.message 
        });
      }
    }

    const updatedMember = await OurTeam.findByIdAndUpdate(
      req.params.id,
      { 
        name: name || member.name,
        position: position || member.position,
        description: description || member.description,
        image: imageUrl 
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: updatedMember
    });
  } catch (error) {
    console.error('Update Team Member Error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid team member ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to update team member',
      details: error.message 
    });
  }
};

// Delete team member
export const deleteTeamMember = async (req, res) => {
  try {
    const member = await OurTeam.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ 
        success: false,
        error: 'Team member not found' 
      });
    }

    // Delete image from S3 if it exists
    if (member.image) {
      try {
        await deleteFile(member.image);
      } catch (deleteError) {
        console.warn('Failed to delete team member image from S3:', deleteError.message);
        // Continue with member deletion even if image deletion fails
      }
    }

    await OurTeam.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    console.error('Delete Team Member Error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid team member ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete team member',
      details: error.message 
    });
  }
};