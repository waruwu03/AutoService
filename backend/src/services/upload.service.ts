import cloudinary from '../config/cloudinary.config';
import crypto from 'crypto';

export class UploadService {
  async uploadImage(file: Express.Multer.File, folder: string = 'images'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          public_id: crypto.randomUUID(),
        },
        (error, result) => {
          if (error) return reject(error);
          if (result) return resolve(result.public_id);
          reject(new Error('Unknown error during upload to Cloudinary'));
        }
      );
      
      // We pass the buffer from multer directly to Cloudinary
      uploadStream.end(file.buffer);
    });
  }

  async deleteFile(fileKey: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(fileKey);
    } catch (error) {
      console.error('Failed to delete from Cloudinary', error);
    }
  }

  async getPresignedUrl(fileKey: string): Promise<string> {
    try {
      // Cloudinary generates public secure URLs directly
      return cloudinary.url(fileKey, { secure: true });
    } catch (error) {
      console.warn('⚠️ Failed to get URL from Cloudinary', error);
      return `/api/v1/uploads/${fileKey}`; // Fallback (should ideally not happen)
    }
  }
}

export const uploadService = new UploadService();
