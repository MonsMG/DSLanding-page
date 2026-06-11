// src/services/storageService.ts
import { supabase } from "@/lib/supabase";
import { STORAGE_BUCKETS, VALIDATION } from "@/constants";

/**
 * Validates and uploads a file to Supabase Storage.
 * @param file The file object to upload
 * @param allowedTypes Array of allowed MIME types (defaults to image types)
 * @param maxSize Maximum allowed size in bytes (defaults to 5MB)
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  allowedTypes: readonly string[] = VALIDATION.ALLOWED_IMAGE_TYPES,
  maxSize: number = VALIDATION.MAX_IMAGE_SIZE
): Promise<string> {
  // 1. Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1]).join(", ")}`);
  }

  // 2. Validate file size
  if (file.size > maxSize) {
    throw new Error(`File is too large. Maximum size is ${(maxSize / (1024 * 1024)).toFixed(0)}MB.`);
  }

  // 3. Generate unique filename
  const fileExt = file.name.split(".").pop();
  const baseName = file.name.replace(`.${fileExt}`, "");
  const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `${cleanName}_${Date.now()}.${fileExt}`;

  // 4. Upload file
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.IMAGES)
    .upload(fileName, file);

  if (error) {
    console.error("Supabase Storage Upload Error:", error);
    throw new Error("Failed to upload file to server storage.");
  }

  // 5. Get Public URL
  const { data: publicUrlData } = supabase.storage
    .from(STORAGE_BUCKETS.IMAGES)
    .getPublicUrl(fileName);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error("Failed to get public URL for uploaded file.");
  }

  return publicUrlData.publicUrl;
}

/**
 * Extracts the filename from a public URL and deletes it from the storage bucket.
 * @param url The public URL of the file to delete
 */
export async function deleteFileByUrl(url: string): Promise<void> {
  if (!url) return;

  try {
    // Expected URL structure:
    // .../storage/v1/object/public/images/filename_123.jpg
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const searchString = `/storage/v1/object/public/${STORAGE_BUCKETS.IMAGES}/`;
    
    const index = pathname.indexOf(searchString);
    if (index !== -1) {
      const filePath = pathname.substring(index + searchString.length);
      const decodedPath = decodeURIComponent(filePath);

      const { error } = await supabase.storage
        .from(STORAGE_BUCKETS.IMAGES)
        .remove([decodedPath]);

      if (error) {
        console.error(`Error deleting file "${decodedPath}" from storage:`, error);
      } else {
        console.log(`Successfully deleted old file "${decodedPath}" from storage.`);
      }
    }
  } catch (error) {
    console.error("Failed to parse URL for storage file deletion:", error);
  }
}
