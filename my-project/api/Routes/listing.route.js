import express from 'express';
import {
    createListing,
    uploadListingImages,
    deleteListing,
    updateListing,
    getListing,
    getListings,
    featuredListings,
    allProjects
    
    
} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUsers.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.post('/upload', verifyToken, uploadListingImages);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing)
router.get('/get/:id', getListing,);
router.post('/get', getListings)
router.get('/', featuredListings)
router.get('/all-projects', allProjects)

export default router;
