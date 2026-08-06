import * as path from 'path';

const IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.bmp',
  '.webp',
  '.avif',
  '.tif',
  '.tiff',
  '.heic',
  '.heif',
  '.ico',
  '.jp2',
  '.jxl',
  '.raw',
  '.dng',
  '.cr2',
  '.cr3',
  '.nef',
  '.arw',
  '.rw2',
  '.orf',
  '.sr2',
  '.pef',
  '.raf',
  '.mrw',
  '.x3f',
  '.bay',
  '.kdc',
  '.nrw',
  '.jpe',
  '.jif',
  '.jfif',
]);

export function resolveFileCategory(
  _buffer: Buffer,
  originalName = '',
  mimeType = '',
): 'image' | 'video' | 'raw' {
  const normalizedMime = (mimeType || '').toLowerCase();
  const extension = path.extname(originalName || '').toLowerCase();

  if (normalizedMime.startsWith('image/')) {
    return 'image';
  }

  if (normalizedMime.startsWith('video/')) {
    return 'video';
  }

  if (IMAGE_EXTENSIONS.has(extension)) {
    return 'image';
  }

  return 'raw';
}

export function getPreferredImageExtension(
  mimeType = '',
  originalName = '',
): string {
  const extension = path.extname(originalName || '').toLowerCase();
  if (extension) {
    return extension.replace('.', '');
  }

  const normalizedMime = (mimeType || '').toLowerCase();
  if (normalizedMime === 'image/jpeg' || normalizedMime === 'image/jpg') {
    return 'jpg';
  }
  if (normalizedMime === 'image/png') return 'png';
  if (normalizedMime === 'image/webp') return 'webp';
  if (normalizedMime === 'image/avif') return 'avif';
  if (normalizedMime === 'image/gif') return 'gif';
  if (normalizedMime === 'image/tiff' || normalizedMime === 'image/tif') {
    return 'tiff';
  }
  if (normalizedMime === 'image/heic') return 'heic';
  if (normalizedMime === 'image/heif') return 'heif';

  return 'jpg';
}

export function getPreferredImageMimeType(mimeType = '', originalName = '') {
  const preferredExtension = getPreferredImageExtension(mimeType, originalName);

  switch (preferredExtension) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'avif':
      return 'image/avif';
    case 'gif':
      return 'image/gif';
    case 'tiff':
    case 'tif':
      return 'image/tiff';
    case 'heic':
      return 'image/heic';
    case 'heif':
      return 'image/heif';
    case 'jpg':
    case 'jpeg':
    default:
      return mimeType || 'image/jpeg';
  }
}
