import {
  isVideoPost,
  isSpotterPost,
  VIDEO_EXTENSIONS,
} from './post-filter.utils';

describe('Post Filter Utils', () => {
  describe('isVideoPost', () => {
    it('should return true for MediaType VIDEO', () => {
      expect(isVideoPost({ mediaType: 'VIDEO' })).toBe(true);
    });

    it('should return true if videoEditingDeclaration is present', () => {
      expect(
        isVideoPost({
          mediaType: 'IMAGE',
          videoEditingDeclaration: 'ADOBE_PREMIER_PRO',
        }),
      ).toBe(true);
    });

    it('should return true for video file extensions in mediaUrl', () => {
      for (const ext of VIDEO_EXTENSIONS) {
        expect(
          isVideoPost({
            mediaType: 'IMAGE',
            mediaUrl: [`https://cdn.example.com/uploads/video1${ext}`],
          }),
        ).toBe(true);
      }
    });

    it('should handle query parameters in mediaUrl with video extensions', () => {
      expect(
        isVideoPost({
          mediaType: 'IMAGE',
          mediaUrl: ['https://cdn.example.com/video.mp4?token=123&exp=456'],
        }),
      ).toBe(true);
    });

    it('should return false for purely image media', () => {
      expect(
        isVideoPost({
          mediaType: 'IMAGE',
          mediaUrl: [
            'https://cdn.example.com/photo.jpg',
            'https://cdn.example.com/photo2.png',
          ],
        }),
      ).toBe(false);
    });

    it('should return false for null/undefined input', () => {
      expect(isVideoPost(null as any)).toBe(false);
      expect(isVideoPost(undefined as any)).toBe(false);
      expect(isVideoPost({})).toBe(false);
    });
  });

  describe('isSpotterPost', () => {
    it('should return true when profileType is SPOTTER', () => {
      expect(isSpotterPost({ profileType: 'SPOTTER' })).toBe(true);
    });

    it('should return true when profile.activeType is SPOTTER', () => {
      expect(
        isSpotterPost({
          profileType: null,
          profile: { activeType: 'SPOTTER' },
        }),
      ).toBe(true);
    });

    it('should return true when postType contains SPOTTER', () => {
      expect(isSpotterPost({ postType: 'Spotter_Post' })).toBe(true);
      expect(isSpotterPost({ postType: 'SPOTTER_SPECIAL' })).toBe(true);
    });

    it('should return false for non-spotter posts', () => {
      expect(
        isSpotterPost({
          profileType: 'OWNER',
          postType: 'Owner_Post',
          profile: { activeType: 'OWNER' },
        }),
      ).toBe(false);
    });

    it('should return false for null/undefined input', () => {
      expect(isSpotterPost(null as any)).toBe(false);
      expect(isSpotterPost(undefined as any)).toBe(false);
      expect(isSpotterPost({})).toBe(false);
    });
  });
});
