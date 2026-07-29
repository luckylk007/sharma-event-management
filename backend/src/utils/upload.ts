import cloudinary from '../config/cloudinary.js';
import { AppError } from '../middlewares/errorHandler.js';

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder = 'sharma-events'
): Promise<{ url: string; publicId: string; width: number; height: number }> => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    const base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    return {
      url: base64,
      publicId: `local-${Date.now()}`,
      width: 1200,
      height: 800,
    };
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          reject(new AppError('Image upload failed', 500));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      }
    );
    stream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || publicId.startsWith('local-')) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};
