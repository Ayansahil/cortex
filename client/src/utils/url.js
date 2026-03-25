/**
 * Constructs a full URL for an uploaded file, ensuring correct formatting for production.
 * @param {string} filePath - The path to the uploaded file (e.g., 'uploads/filename.png').
 * @returns {string|null} - The complete URL or null if filePath is invalid.
 */
export const getUploadUrl = (filePath) => {
  if (!filePath) return null;

  // If filePath is already a full URL (ImageKit), return it directly
  if (filePath.startsWith('http')) {
    return filePath;
  }

  // Use the API base URL from env, default to localhost for development
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/v1";

  // Remove '/v1' or any other version suffix from the base URL for static file serving
  const serverOrigin = apiBaseUrl.replace(/\/v\d+$/, "");

  // Normalize filePath: remove leading slash and any duplicate 'uploads/' prefix
  const cleanPath = filePath.replace(/^\/?(uploads\/)?/, "");

  // Ensure final URL format: <origin>/uploads/<filename>
  return `${serverOrigin}/uploads/${cleanPath}`;
};
