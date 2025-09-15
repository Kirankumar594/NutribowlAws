import Service from '../models/ServiceModel.js';
import { uploadFile2, deleteFile } from '../middleware/aws.js';

// Create Service
export const createService = async (req, res) => {
  try {
    const { title, description, details, benefits } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }
    
    const image = await uploadFile2(req.file, "service");
    const newService = new Service({
      title,
      description,
      details,
      image,
      benefits,
    });
    
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Service
export const updateService = async (req, res) => {
  try {
    const { title, description, details, benefits } = req.body;
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    let image = service.image;
    if (req.file) {
      // Delete old image from AWS
      if (service.image) {
        await deleteFile(service.image); // Assuming deleteFile can handle AWS URLs/keys
      }
      // Upload new image to AWS
      image = await uploadFile2(req.file, "service");
    }
    
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { title, description, details, image, benefits },
      { new: true }
    );
    
    res.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete Service
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    // Delete associated image from AWS
    if (service.image) {
      await deleteFile(service.image);
    }
    
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get All Services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error('Error getting services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Single Service
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error getting service by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
