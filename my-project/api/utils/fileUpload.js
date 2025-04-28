import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';  // Import fs/promises for asynchronous file operations
import { createUploadsDir } from './fileUtils.js';

// Create uploads directory if it doesn't exist
const uploadsDir = createUploadsDir(process.cwd(), '../../uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'avatar-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|png|webp|jpg/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp|image\/jpg/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 5MB limit
});

export { upload };

export const deleteFile = async (filePath) => {
  try {
    await fs.unlink(path.join(process.cwd(), filePath));
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error);
  }
};