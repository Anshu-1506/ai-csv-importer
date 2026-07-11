import express from 'express';
import multer from 'multer';
import { uploadCSV, processImport } from '../controllers/importController';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760')
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

router.post('/upload', upload.single('file'), uploadCSV);
router.post('/import', upload.single('file'), processImport);

export default router;