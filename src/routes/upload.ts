import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';

const router = Router();

// Multer config to store file in memory buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  fileFilter: (req, file, cb) => {
    // Accept images and pdf/docs
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const ext = file.originalname.toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

router.post('/', upload.single('file'), (req:any, res:any) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Upload to Cloudinary using stream
  const streamUpload = (buffer: Buffer) => {
    return new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' }, // supports images and documents
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  };

  streamUpload(req.file.buffer)
    .then(result => {
      res.status(201).json({
        message: 'File uploaded successfully',
        url: result.secure_url,
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Upload failed', error });
    });
});

export default router;
