// src/config/s3.config.ts

import * as Minio from 'minio';

export const s3Config = {
  endPoint: process.env.S3_ENDPOINT || 'localhost',
  port: parseInt(process.env.S3_PORT || '9000'),
  useSSL: process.env.S3_USE_SSL === 'true',
  accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
};

export const S3_BUCKET = process.env.S3_BUCKET || 'autoservis';

let minioClient: Minio.Client | null = null;

export function getMinioClient(): Minio.Client {
  if (!minioClient) {
    minioClient = new Minio.Client(s3Config);
  }
  return minioClient;
}

export async function ensureBucket(): Promise<void> {
  const client = getMinioClient();
  const exists = await client.bucketExists(S3_BUCKET);
  if (!exists) {
    await client.makeBucket(S3_BUCKET);
    console.log(`✅ S3 bucket "${S3_BUCKET}" created`);
  }
}

export default getMinioClient;
