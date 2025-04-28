import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import fs from 'fs/promises';
import path from 'path';
import Listing from '../models/listing.model.js';

export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return next(errorHandler(404, 'User not found'));
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// user.controller.js
export const updateUser = async (req, res, next) => {
  try {
      if (req.user.id !== req.params.id) {
          return res.status(403).json({ message: 'Unauthorized to update this account' });
      }

      const updateData = {};
      if (req.body.username) updateData.username = req.body.username;
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.password) {
          if (req.body.password.length < 6) {
              return res.status(400).json({ message: 'Password must be at least 6 characters' });
          }
          updateData.password = bcrypt.hashSync(req.body.password, 10);
      }

      if (req.file) {
          // Delete old avatar if it exists
          if (req.user.avatar && !req.user.avatar.includes('default-avatar')) {
              const oldAvatarPath = path.join(process.cwd(), 'uploads', path.basename(req.user.avatar));
              try {
                  await fs.unlink(oldAvatarPath);
              } catch (err) {
                  console.error('Error deleting old avatar:', err);
              }
          }

          // Store relative path for flexibility
          updateData.avatar = req.file.filename;
      }

      const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { $set: updateData },
          { new: true, runValidators: true, context: 'query' }
      ).select('-password');

      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      const responseData = updatedUser.toObject();
      if (responseData.avatar && !responseData.avatar.startsWith('http')) {
          responseData.avatar = `${req.protocol}://${req.get('host')}/uploads/${responseData.avatar}`;
      }

      res.status(200).json(responseData);
  } catch (error) {
      console.error('Update error:', error);
      if (error.name === 'ValidationError') {
          const errors = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({ message: errors.join(', ') });
      }
      res.status(500).json({ message: 'Internal server error' });
  }
};


export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only delete your own account'));
  }

  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(errorHandler(404, 'User not found'));

    // Delete avatar if exists
    if (user.avatar && !user.avatar.includes('default-profile')) {
      const avatarPath = path.join('uploads', path.basename(user.avatar));
      try {
        await fs.access(avatarPath); // Check if file exists
        await fs.unlink(avatarPath);
      } catch (error) {
        console.error('Error deleting avatar:', error);
      }
    }

    res.clearCookie('access_token')
       .status(200)
       .json('User has been deleted');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  const userId = req.user.id; // Assuming authentication middleware sets this
  const paramId = req.params._id;
  if (userId === paramId) {
    try {
      const listings = await Listing.find({ userRef: userId });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    next(errorHandler(401, 'You can only view your own listings'));
  }
};

export const getUsers = async(req,res, next)=>{
  try{
   const user = await User.findById(req.params.id);

   if(!user) return next(errorHandler(404,'user not found!'));
    
   const {password:pass, ...rest}=user._doc;
   res.status(200).json(rest);
  }catch(error){
   next(error);
  }

}