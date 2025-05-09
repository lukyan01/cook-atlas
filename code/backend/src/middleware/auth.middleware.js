/**
 * Authentication middleware for protected routes
 */

const UserModel = require('../models/user.model');

// Middleware to verify if the user is authenticated
const auth = async (req, res, next) => {
  try {
    // Check for user_id in the request
    const userId = req.query.user_id || req.body.user_id || req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if the user exists
    const user = await UserModel.getUserById(userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid user ID" });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({ message: "Authentication failed", error: err.message });
  }
};

// Middleware to verify if the user is an admin
const adminAuth = async (req, res, next) => {
    try {
        // First run normal authentication
        await auth(req, res, () => {
            // Check if user has admin role
            if (req.user && req.user.role === 'admin') {
                next();
            } else {
                res.status(403).json({message: 'Admin privileges required'});
            }
        });
    } catch (err) {
        console.error('Admin authentication error:', err);
        res.status(401).json({message: 'Authentication failed', error: err.message});
    }
};

module.exports = {
  auth,
  adminAuth,
};
