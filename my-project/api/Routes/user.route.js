import express from 'express';
import { 
  test, 
  updateUser, 
  getUser, 
  deleteUser,
  getUserListings,
  getUsers
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUsers.js';
import { upload } from '../utils/fileUpload.js';

const router = express.Router();

router.get('/test', test);
router.get('/:id', verifyToken, getUser);
router.put('/update/:id', verifyToken, upload.single('avatar'), updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:_id', verifyToken, getUserListings);
router.get('/:id', verifyToken, getUsers)

export default router;