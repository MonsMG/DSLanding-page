// src/constants/index.ts

export const DB_TABLES = {
  PRODUCTIONS: 'productions',
  PRODUCTION_MEDIA: 'production_media',
  PRODUCTION_GEAR: 'production_gear',
  PRODUCTION_GEAR_USED: 'production_gear_used',
  BEHIND_THE_SCENES: 'behind_the_scenes',
  SOFTWARE_PROJECTS: 'software_projects',
  ABOUT: 'about',
} as const;

export const STORAGE_BUCKETS = {
  IMAGES: 'images',
} as const;

export const VALIDATION = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_PDF_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_PDF_TYPES: ['application/pdf'],
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You do not have permission to perform this action.',
  VALIDATION_ERROR: 'Please check your inputs.',
  UPLOAD_FAILED: 'Could not upload file. Please try again.',
  FETCH_FAILED: 'Failed to load data.',
  SAVE_FAILED: 'Failed to save data. Please try again.',
  DELETE_FAILED: 'Failed to delete item.',
  UNEXPECTED_ERROR: 'An unexpected error occurred.',
} as const;

export const GEAR_CATEGORIES = [
  'Camera',
  'Lens',
  'Light',
  'Audio',
  'Stabilizer',
  'Drone',
  'Tripod',
  'Accessory',
] as const;

export const PRODUCTION_CATEGORIES = [
  'Commercial',
  'Music Video',
  'Short Film',
  'Documentary',
  'Event',
  'Behind The Scenes',
] as const;
