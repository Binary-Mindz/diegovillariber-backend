import { MediaType } from 'generated/prisma/enums';

export type PostModerationRow = {
  id: string;

  mediaType: MediaType;
  mediaUrl: string[];

  caption: string | null;
  createdAt: Date;

  like: number;
  comment: number;
  share: number;

  author: {
    userId: string;
    profileId: string | null;
    name: string | null;
    avatarUrl: string | null;
    email: string;
  };

  hashtags: string[];
};

export type PostModerationListResponse = {
  data: PostModerationRow[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};