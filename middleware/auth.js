import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const authMiddleware = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get admin from token
    req.admin = await Admin.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;