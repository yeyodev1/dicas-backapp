import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import { uploadImage, deleteImage } from '../services/upload.service';
import { CustomError } from '../errors/customError.error';

export async function upload(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const file = req.file;
    if (!file) throw new CustomError('No se recibió ningún archivo', 400);

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowed.includes(file.mimetype)) {
      throw new CustomError('Formato no permitido. Usa JPG, PNG, WebP o GIF', 400);
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new CustomError('Imagen demasiado grande (máx 10 MB)', 400);
    }

    const result = await uploadImage(file.buffer, file.originalname);
    res.status(200).json({ url: result.url, publicId: result.publicId });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { publicId } = req.body;
    if (!publicId) throw new CustomError('publicId requerido', 400);
    await deleteImage(publicId);
    res.status(200).json({ ok: true });
  } catch (error) {
    next(error);
  }
}
