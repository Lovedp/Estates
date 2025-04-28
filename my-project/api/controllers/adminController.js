import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
//import Message from '../models/Message.js';
// Admin-specific login controller
// controllers/admin/authController.js
// controllers/admin/authController.js
// controllers/authController.js
// controllers/authController.js
export const adminSignIn = async (req, res) => {
  const { email = "ifedolapoemmanue@gmail.com", password = "12345" } = req.body;

  try {
    // Debug logging
    console.log('Admin login attempt for:', email);
    
    const user = await User.findOne({ email })
      .select('+password +isAdmin')
      .lean();

    if (!user) {
      console.error('User not found:', email);
      return res.status(404).json({ message: 'Credentials invalid' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Password mismatch for:', email);
      return res.status(401).json({ message: 'Credentials invalid' });
    }

    if (user.isAdmin !== true) {
      console.error('Admin access denied for:', email, 'isAdmin:', user.isAdmin);
      return res.status(403).json({ message: 'Admin privileges required' });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Successful admin login:', email);
    res.cookie('access_token', token, { httpOnly: true, secure: true })
       .json({ user: { ...user, password: undefined } });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Admin token refresh controller
export const refreshAdminToken = async (req, res, next) => {
  const { refresh_token } = req.cookies;

  if (!refresh_token) {
    return next(errorHandler(401, 'Refresh token required'));
  }

  try {
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refresh_token) {
      return next(errorHandler(403, 'Invalid refresh token'));
    }

    // Verify user is still admin
    if (!user.isAdmin) {
      return next(errorHandler(403, 'Admin privileges no longer available'));
    }

    // Generate new access token
    const newToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res
      .status(200)
      .cookie('access_token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000
      })
      .json({
        success: true,
        message: 'Token refreshed successfully'
      });

  } catch (error) {
    next(errorHandler(403, 'Invalid or expired refresh token'));
  }
};
// Get all users (excluding passwords)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
};

// Send message to user
export const sendMessageToUser = async (req, res) => {
  try {
    const { message } = req.body;
    const newMessage = await Message.create({
      sender: req.user._id,
      recipient: req.params.id,
      content: message
    });
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
};

// Get all listings
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.status(200).json({ success: true, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching listings' });
  }
};

// Create a listing (admin-uploaded)
export const createListing = async (req, res) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      creator: req.user._id
    });
    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating listing' });
  }
};

// Delete a listing
export const deleteListing = async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting listing' });
  }
};