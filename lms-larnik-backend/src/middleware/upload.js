const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    './uploads',
    './uploads/videos',
    './uploads/documents',
    './uploads/images',
    './uploads/certificates',
    './uploads/mous'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure storage for different file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = './uploads/';
    
    if (file.fieldname === 'video') {
      uploadPath += 'videos/';
    } else if (file.fieldname === 'document' || file.fieldname === 'mou') {
      uploadPath += 'documents/';
    } else if (file.fieldname === 'image' || file.fieldname === 'avatar') {
      uploadPath += 'images/';
    } else if (file.fieldname === 'certificate') {
      uploadPath += 'certificates/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
  const allowedDocumentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  
  if (file.fieldname === 'video' && allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if ((file.fieldname === 'document' || file.fieldname === 'mou') && allowedDocumentTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if ((file.fieldname === 'image' || file.fieldname === 'avatar') && allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024, // 100MB default
    files: 10 // Maximum 10 files
  }
});

// Specific upload configurations
const uploadVideo = upload.single('video');
const uploadDocument = upload.single('document');
const uploadImage = upload.single('image');
const uploadAvatar = upload.single('avatar');
const uploadMou = upload.single('mou');
const uploadMultiple = upload.array('files', 10);

// Error handling for uploads
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Unexpected file field'
      });
    }
  }
  
  if (err.message === 'Invalid file type') {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type'
    });
  }
  
  next(err);
};

module.exports = {
  uploadVideo,
  uploadDocument,
  uploadImage,
  uploadAvatar,
  uploadMou,
  uploadMultiple,
  handleUploadError
};
