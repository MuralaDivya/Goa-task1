import heic2any from 'heic2any';

export interface ImageProcessResult {
  image: HTMLImageElement;
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * Loads an uploaded File (JPG, PNG, HEIC, WEBP) into an HTMLImageElement
 */
export async function processUploadedFile(file: File): Promise<ImageProcessResult> {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  let blobToLoad: Blob = file;

  // Convert HEIC/HEIF if needed
  if (
    fileName.endsWith('.heic') ||
    fileName.endsWith('.heif') ||
    fileType.includes('heic') ||
    fileType.includes('heif')
  ) {
    try {
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });

      blobToLoad = Array.isArray(converted) ? converted[0] : converted;
    } catch (err) {
      console.warn('HEIC conversion via heic2any failed, attempting direct load:', err);
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        resolve({
          image: img,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          aspectRatio: (img.naturalWidth || img.width) / (img.naturalHeight || img.height),
        });
      };
      img.onerror = () => reject(new Error('Invalid image data. Try a JPG or PNG file.'));
      img.src = reader.result as string;
    };
    reader.readAsDataURL(blobToLoad);
  });
}

/**
 * Creates an image element from a Data URL or Image URL
 */
export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image from URL'));
    img.src = url;
  });
}
