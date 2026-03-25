import ImageKit from 'imagekit';
import config from '../core/config/env.config.js';

const imagekit = new ImageKit({
  publicKey: config.imagekit.publicKey,
  privateKey: config.imagekit.privateKey,
  urlEndpoint: config.imagekit.urlEndpoint,
});

/**
 * Uploads a file buffer to ImageKit.
 * @param {Buffer} fileBuffer - The buffer of the file to upload.
 * @param {string} fileName - The name to give the file in ImageKit.
 * @param {string} folder - The folder to upload to in ImageKit.
 * @returns {Promise<Object>} - The ImageKit upload response.
 */
export const uploadToImageKit = async (fileBuffer, fileName, folder = '/Cortex') => {
  try {
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: folder,
      useUniqueFileName: true,
    });
    return response;
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw new Error('Failed to upload image to ImageKit');
  }
};

export default imagekit;
