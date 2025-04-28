import express from 'express';
import {
  getAllUsers,
  deleteUser,
  getAllListings,
  deleteListing,
  createListing,
  sendMessageToUser,
  adminSignIn,
  refreshAdminToken

} from '../controllers/adminController.js';
import { isAdmin } from '../Routes/auth.route.js';
import { verifyToken } from '../utils/verifyUsers.js';

const router = express.Router();

// 👇 All routes require admin privileges



// 🟢 User Management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.post('/users/message/:id', sendMessageToUser);

router.post('/signin', adminSignIn);
router.post('/refresh-token', refreshAdminToken);
router.use(verifyToken);
router.use(isAdmin);


// 🟠 Listing Management
router.get('/listings', getAllListings);
router.delete('/listings/:id', deleteListing);
router.post('/lists', createListing);

export default router;