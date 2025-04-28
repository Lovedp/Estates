import fs from 'fs';
import path from 'path';

export const createUploadsDir = (baseDir) => {
  const uploadsPath = path.join(baseDir, 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  return uploadsPath;
};

// Helper function to delete old files
export const deleteFile = async (filePath) => {
  try {
    await fs.promises.access(filePath);
    await fs.promises.unlink(filePath);
  } catch (err) {
    console.error('Error deleting file:', err);
  }
};