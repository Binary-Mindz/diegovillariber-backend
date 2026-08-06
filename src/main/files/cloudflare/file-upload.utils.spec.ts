import {
  getPreferredImageExtension,
  resolveFileCategory,
} from './file-upload.utils';

describe('file upload utilities', () => {
  it('treats HEIC/HEIF and other image MIME types as images', () => {
    expect(
      resolveFileCategory(
        Buffer.from([0x00, 0x00]),
        'sample.heic',
        'image/heic',
      ),
    ).toBe('image');
    expect(
      resolveFileCategory(
        Buffer.from([0x00, 0x00]),
        'sample.heif',
        'image/heif',
      ),
    ).toBe('image');
    expect(
      resolveFileCategory(
        Buffer.from([0x00, 0x00]),
        'sample.cr3',
        'image/x-canon-cr3',
      ),
    ).toBe('image');
  });

  it('preserves suitable extensions for modern image formats', () => {
    expect(getPreferredImageExtension('image/heic', 'sample.heic')).toBe(
      'heic',
    );
    expect(getPreferredImageExtension('image/webp', 'sample.webp')).toBe(
      'webp',
    );
    expect(getPreferredImageExtension('image/avif', 'sample.avif')).toBe(
      'avif',
    );
  });
});
