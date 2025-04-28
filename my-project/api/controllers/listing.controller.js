import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import { deleteFile } from '../utils/fileUpload.js'; // Helper for cleaning up failed uploads
import {upload} from '../utils/fileUpload.js'
import { listingSchema } from '../validators/listing.validator.js'; // Joi validation

export const createListing = async (req, res, next) => {
  try {
    // Validate required fields
    if (!req.body.type || !['sale', 'rent'].includes(req.body.type)) {
      return res.status(400).json({
        success: false,
        message: '"type" must be either "sale" or "rent"'
      });
    }

    if (!req.body.category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    if (!req.body.imageUrls || req.body.imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    // Create listing
    const listing = await Listing.create({
      ...req.body,
      userRef: req.user.id,
      bedrooms: parseInt(req.body.bedrooms),
      bathrooms: parseInt(req.body.bathrooms),
      regularPrice: parseInt(req.body.regularPrice),
      discountedPrice: parseInt(req.body.discountedPrice) || 0
    });

    res.status(201).json({
      success: true,
      listing
    });
  } catch (error) {
    next(error);
  }
};

// Upload multiple listing images
export const uploadListingImages = async (req, res, next) => {
  upload.array('image', 6)(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return next(err);
    }

    try {
      // 1. Validate Files
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No images provided' });
      }

      // 2. Check File Count (Max 6 as per your frontend)
      if (req.files.length > 6) {
        // Cleanup uploaded files
        await Promise.all(req.files.map(file => deleteFile(file.path)));
        return res.status(400).json({ message: 'Maximum 6 images allowed' });
      }

      // 3. Validate File Types
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const invalidFiles = req.files.filter(
        file => !validMimeTypes.includes(file.mimetype)
      );

      if (invalidFiles.length > 0) {
        // Cleanup invalid files
        await Promise.all(invalidFiles.map(file => deleteFile(file.path)));
        return res.status(400).json({
          message: 'Invalid file type',
          acceptedTypes: validMimeTypes
        });
      }

      // 4. Process Files (In production, upload to cloud storage like S3)
      const imageUrls = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        path: file.path,
        filename: file.filename
      }));
      console.log('Generated URLs:', imageUrls)
      // 5. Return Response
      res.status(200).json({
        success: true,
        urls: imageUrls.map(img => img.url),
        message: 'Images uploaded successfully'
      });
    } catch (error) {
      console.error('Image upload error:', error);

      // Cleanup any uploaded files on error
      if (req.files?.length) {
        await Promise.all(req.files.map(file => deleteFile(file.path)))
          .catch(cleanupError => console.error('Cleanup failed:', cleanupError));
      }

      next(error); // Pass the error to the error handling middleware
    }
  });
};

export const deleteListing = async(req, res, next)=>{
  const listing= await Listing.findById(req.params.id);

  if(!listing){
    return next(errorHandler(404, 'Listing not found'));
  }
  if(req.user.id !== listing.userRef){
    return next(errorHandler(401,'you can only delete your own listing!'));
  }
  try{
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted')
  }catch(error){
    next(error);
  }
};

export const updateListing = async (req,res, next)=>{
  const listing = await Listing.findById(req.params.id);
  if(!listing){
    return next(errorHandler(404,'Listing not found!'));
  }
  if(req.user.id !== listing.userRef){
    return next(errorHandler(401,'you can only update your own listings!'));
  }
  try{
   const updateListing = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new:true}
   );
   res.status(200).json(updateListing);
  }catch(error){
    next(error)
  }
};

export const getListing = async (req,res, next)=>{
  try{
  const listing = await Listing.findById(req.params.id);
  if(!listing){
    return next(errorHandler(404,'Listing not found!'));
  }
  res.status(200).json(listing);
  }catch(error){
    next(error)
  }

}


export const getListings = async (req, res, next) => {
  try {
    const { city, type, listingType } = req.body;
    const query = {};
    
    // City filter
    if (city) {
      query.address = { $regex: city, $options: 'i' };
    }
    
    // Property type filter
    if (type && type !== 'All') {
      const typeMap = {
        'Apartment': 'apartment',
        'Town House': 'family-house',
        'Office': 'offices',
        'Land': 'lands',
        'Modern Villa': 'modern-villa'
      };
      
      query.category = typeMap[type] || type.toLowerCase();
    }
    
    // Sale/Rent filter
    if (listingType) {
      query.type = listingType;
    }
    
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
    
  } catch (error) {
    next(error);
  }
};

export const featuredListings = async (req,res, next) => {
  try{
    
    

  }catch(error){
    next(error)
  }
}

export const allProjects = async (req, res, next) => {
  try {
    let projects = await Listing.find().lean();
    
    if (!projects || projects.length === 0) {
      return res.status(200).json({ 
        success: true,
        data: [],
        message: 'No projects found'
      });
    }

    // Normalize data structure only if projects exist
    const normalizedProjects = projects.map(project => ({
      _id: project._id,
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl || '',
      creator: project.creator || {
        username: project.createdBy?.username || 'Unknown',
        email: project.createdBy?.email || '',
        profilePicture: project.createdBy?.profilePicture || ''
      },
      createdAt: project.createdAt
    }));

    return res.status(200).json({
      success: true,
      count: normalizedProjects.length,
      data: normalizedProjects
    });
    
  } catch(error) {
    next(error);
  }
}
