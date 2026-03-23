import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config/env.config.js';

// FIX: Auto-create uploads folder if it doesn't exist
const uploadPath = config.upload?.path || 'uploads';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log(`✅ Created uploads directory: ${uploadPath}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = config.upload?.allowedTypes || [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'video/mp4', 'video/webm',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.upload?.maxFileSize || 10 * 1024 * 1024, 
  },
  fileFilter: fileFilter,
});

export default upload;