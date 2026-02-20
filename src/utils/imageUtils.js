/**
 * Image utility functions for compression, conversion, and validation
 */

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOC_TYPES = ['application/pdf', ...ALLOWED_IMAGE_TYPES];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const COMPRESSION_MAX_WIDTH = 1200;
const COMPRESSION_QUALITY = 0.7;

/**
 * Validate file type
 */
export function validateFileType(file, allowPdf = false) {
  const allowed = allowPdf ? ALLOWED_DOC_TYPES : ALLOWED_IMAGE_TYPES;
  return allowed.includes(file.type);
}

/**
 * Validate file size
 */
export function validateFileSize(file, maxSize = MAX_IMAGE_SIZE) {
  return file.size <= maxSize;
}

/**
 * Convert a file to base64 string
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Compress an image file and return base64
 */
export function compressImage(file, maxWidth = COMPRESSION_MAX_WIDTH, quality = COMPRESSION_QUALITY) {
  return new Promise((resolve, reject) => {
    // If it's a PDF, just convert to base64 without compression
    if (file.type === 'application/pdf') {
      fileToBase64(file).then(resolve).catch(reject);
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      // Scale down if wider than maxWidth
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Process multiple files: validate, compress, and return array of base64 strings
 */
export async function processFiles(files, allowPdf = false) {
  const results = [];
  const errors = [];

  for (const file of files) {
    if (!validateFileType(file, allowPdf)) {
      errors.push(`${file.name}: Invalid file type`);
      continue;
    }
    if (!validateFileSize(file)) {
      errors.push(`${file.name}: File too large (max 10MB)`);
      continue;
    }

    try {
      const base64 = await compressImage(file);
      results.push({
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64,
      });
    } catch {
      errors.push(`${file.name}: Failed to process`);
    }
  }

  return { results, errors };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
