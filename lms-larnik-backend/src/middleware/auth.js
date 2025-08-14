const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ 
          success: false, 
          error: 'Account is deactivated' 
        });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ 
        success: false, 
        error: 'Not authorized, token failed' 
      });
    }
  }

  if (!token) {
    res.status(401).json({ 
      success: false, 
      error: 'Not authorized, no token' 
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

// Check if user is owner or has permission
const checkOwnership = (model, field = 'user') => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found'
        });
      }

      // Super admin can access everything
      if (req.user.role === 'superAdmin') {
        return next();
      }

      // Check if user owns the resource
      if (resource[field].toString() === req.user._id.toString()) {
        return next();
      }

      // University staff can access university resources
      if (req.user.role === 'universityAdmin' && resource.university) {
        if (resource.university.toString() === req.user.university.toString()) {
          return next();
        }
      }

      res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { protect, authorize, checkOwnership };
