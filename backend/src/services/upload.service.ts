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
          if (result) return resolve(result.secure_url); // Mengembalikan URL utuh
          reject(new Error('Unknown error during upload to Cloudinary'));
        }
      );
      
      uploadStream.end(file.buffer);
    });
  }

  async deleteFile(fileKey: string): Promise<void> {
    try {
      let publicId = fileKey;
      // Jika fileKey berupa URL utuh Cloudinary, ekstrak public_id-nya
      if (fileKey.startsWith('http')) {
        // Contoh: https://res.cloudinary.com/demo/image/upload/v1612345/folder/id.jpg
        const matches = fileKey.match(/\/v\d+\/(.+)\.[a-zA-Z]+$/);
        if (matches && matches[1]) {
          publicId = matches[1];
        }
      }
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Failed to delete from Cloudinary', error);
    }
  }

  async getPresignedUrl(fileKey: string): Promise<string> {
    try {
      if (fileKey.startsWith('http')) return fileKey;
      return cloudinary.url(fileKey, { secure: true });
    } catch (error) {
      console.warn('⚠️ Failed to get URL from Cloudinary', error);
      return `/api/v1/uploads/${fileKey}`;
    }
  }
}

export const uploadService = new UploadService();
