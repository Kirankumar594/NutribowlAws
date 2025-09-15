import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Get the correct S3 URL format
 */
const getS3Url = (bucketName, key) => {
  const region = process.env.AWS_REGION;
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

/**
 * Upload a file from formidable (file system path)
 */
const uploadFile = async (file, bucketname) => {
  try {
    const fs = await import('fs');
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, // Fixed: Changed from AWS_S3_BUCKET_NAME
      Key: `${bucketname}/${Date.now()}_${file.originalFilename}`,
      Body: fs.createReadStream(file.filepath),
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return getS3Url(process.env.AWS_BUCKET_NAME, params.Key); // Fixed here too
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};

/**
 * Upload a file from multer (buffer)
 */
const uploadFile2 = async (file, bucketname) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, // Fixed: Changed from AWS_S3_BUCKET_NAME
      Key: `${bucketname}/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return getS3Url(process.env.AWS_BUCKET_NAME, params.Key); // Fixed here too
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};

/**
 * Extract file key from S3 URL
 */
const getUrlFileKey = (url) => {
  const regex = /^https?:\/\/([^\.]+)\.s3\.(?:[^\.]+\.)?amazonaws\.com\/(.+)$/;
  const match = url.match(regex);
  if (match) {
    return match[2];
  } else {
    throw new Error(`Invalid S3 URL: ${url}`);
  }
};

/**
 * Delete a file from S3
 */
const deleteFile = async (url) => {
  try {
    const fileKey = getUrlFileKey(url);
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, // Fixed: Changed from AWS_S3_BUCKET_NAME
      Key: fileKey,
    };

    const command = new DeleteObjectCommand(params);
    return await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error(`Error deleting file: ${error.message}`);
  }
};

/**
 * Update a file in S3 (delete and re-upload)
 */
const updateFile = async (url, newFile, bucketname) => {
  try {
    const fileKey = getUrlFileKey(url);
    await deleteFile(url);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, // Fixed: Changed from AWS_S3_BUCKET_NAME
      Key: fileKey,
      Body: newFile.buffer,
      ContentType: newFile.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return getS3Url(process.env.AWS_BUCKET_NAME, fileKey); // Fixed here too
  } catch (error) {
    console.error("Error updating file:", error);
    throw new Error(`Error updating file: ${error.message}`);
  }
};

/**
 * Upload multiple files
 */
const multifileUpload = async (files, bucketname) => {
  try {
    const uploadPromises = files.map(async (file) => {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME, // Fixed: Changed from AWS_S3_BUCKET_NAME
        Key: `${bucketname}/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      return getS3Url(process.env.AWS_BUCKET_NAME, params.Key); // Fixed here too
    });

    return Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw new Error(`Error uploading multiple files: ${error.message}`);
  }
};

export {
  s3Client,
  uploadFile,
  uploadFile2,
  deleteFile,
  updateFile,
  multifileUpload,
  getS3Url,
  getUrlFileKey
};