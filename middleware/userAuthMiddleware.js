import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assuming you have a User model

const userAuthMiddleware = async (req, res, next) => {
  try {
    // Get token from header (supports both 'Authorization' and 'x-auth-token')
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                 req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and attach to request
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user and token to request
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    let message = 'Invalid authentication token';
    if (error.name === 'TokenExpiredError') {
      message = 'Session expired. Please login again.';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    }

    res.status(401).json({ 
      success: false,
      message
    });
  }
};

export default userAuthMiddleware;