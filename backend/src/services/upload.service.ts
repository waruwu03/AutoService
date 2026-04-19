import { getMinioClient, S3_BUCKET } from '../config/s3.config';
import crypto from 'crypto';
import path from 'path';

export class UploadService {
  async uploadImage(file: Express.Multer.File, folder: string = 'images'): Promise<string> {
    const minioClient = getMinioClient();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${crypto.randomUUID()}${fileExtension}`;
    
    await minioClient.putObject(
      S3_BUCKET,
      fileName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype }
    );

    // In a real S3 setup, this would be the public URL
    // For MinIO locally, this usually depends on the host config
    return fileName;
  }

  async deleteFile(fileKey: string): Promise<void> {
    const minioClient = getMinioClient();
    await minioClient.removeObject(S3_BUCKET, fileKey);
  }

  async getPresignedUrl(fileKey: string): Promise<string> {
    const minioClient = getMinioClient();
    return await minioClient.presignedGetObject(S3_BUCKET, fileKey, 24 * 60 * 60);
  }
}

export const uploadService = new UploadService();
