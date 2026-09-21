import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, isFirebaseConfigured } from '../lib/firebase';

const MAX_IMAGE_SIZE_MB = 10;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const validateImageFile = (file: File): FileValidationResult => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload JPG, PNG, WebP, or SVG.',
    };
  }

  const sizeMb = file.size / (1024 * 1024);
  if (sizeMb > MAX_IMAGE_SIZE_MB) {
    return {
      valid: false,
      error: `File is too large (${sizeMb.toFixed(1)}MB). Maximum allowed size is ${MAX_IMAGE_SIZE_MB}MB.`,
    };
  }

  return { valid: true };
};

/**
 * Uploads an image file to Firebase Storage.
 * @param file The file to upload
 * @param path Storage path (e.g., 'projects/123/cover.jpg')
 * @param onProgress Optional callback receiving upload progress (0-100)
 * @returns The public download URL from Firebase Storage
 */
export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: (percent: number) => void
): Promise<string> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid file');
  }

  if (!isFirebaseConfigured()) {
    // Graceful fallback for local development before Firebase keys are entered:
    // Create an object URL so the user can test the UI immediately
    console.warn('Firebase is not configured. Falling back to local Object URL for preview.');
    if (onProgress) onProgress(100);
    return URL.createObjectURL(file);
  }

  // Create unique filename to prevent collisions and cache bugs
  const extension = file.name.split('.').pop() || 'jpg';
  const cleanPath = path.endsWith('/') ? path : `${path}/`;
  const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${extension}`;
  const fullStoragePath = `${cleanPath}${uniqueName}`;

  const storageRef = ref(storage, fullStoragePath);
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(Math.round(progress));
      },
      (error) => {
        console.error('Firebase Storage upload error:', error);
        reject(new Error(`Upload failed: ${error.message}`));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err: any) {
          reject(new Error(`Failed to retrieve download URL: ${err.message}`));
        }
      }
    );
  });
};

/**
 * Deletes a file from Firebase Storage given its download URL.
 */
export const deleteFileByUrl = async (url: string): Promise<void> => {
  if (!url || !url.includes('firebasestorage.googleapis.com')) {
    return;
  }
  if (!isFirebaseConfigured()) return;

  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (err) {
    console.warn('Could not delete file from Firebase Storage:', err);
  }
};
