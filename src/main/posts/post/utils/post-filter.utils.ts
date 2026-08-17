export const VIDEO_EXTENSIONS = [
  '.mp4',
  '.mov',
  '.webm',
  '.avi',
  '.mkv',
  '.m4v',
  '.3gp',
  '.flv',
  '.wmv',
];

export function isVideoPost(post: {
  mediaType?: string | null;
  postType?: string | null;
  videoEditingDeclaration?: any;
  mediaUrl?: string[] | null;
}): boolean {
  if (!post) return false;
  if (post.mediaType === 'VIDEO') return true;
  if (post.videoEditingDeclaration) return true;
  if (
    post.postType &&
    typeof post.postType === 'string' &&
    post.postType.toLowerCase().includes('video')
  ) {
    return true;
  }
  if (post.mediaUrl && Array.isArray(post.mediaUrl)) {
    return post.mediaUrl.some((url) => {
      if (!url || typeof url !== 'string') return false;
      const cleanUrl = url.split('?')[0].toLowerCase();
      return VIDEO_EXTENSIONS.some((ext) => cleanUrl.endsWith(ext));
    });
  }
  return false;
}

export function isSpotterPost(post: {
  profileType?: string | null;
  postType?: string | null;
  profile?: { activeType?: string | null } | null;
}): boolean {
  if (!post) return false;
  if (post.profileType === 'SPOTTER') return true;
  if (post.profile?.activeType === 'SPOTTER') return true;
  if (
    post.postType &&
    typeof post.postType === 'string' &&
    post.postType.toUpperCase().includes('SPOTTER')
  ) {
    return true;
  }
  return false;
}
