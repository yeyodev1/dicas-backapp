import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as uploadController from '../controllers/upload.controller';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

router.post('/image', authMiddleware, upload.single('image'), uploadController.upload);
router.delete('/image', authMiddleware, uploadController.remove);

export default router;
