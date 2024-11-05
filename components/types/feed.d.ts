// @components/types/feed.ts

export interface HotTopicFeedResponseDTO {
  id: number;
  authorType: 'USER' | 'GUEST';
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  channelType: 'MYCHANNEL' | 'CATEGORYCHANNEL';
  user?: {
    userName: string;
    displayName: string;
    userImg: string;
  };
  guest?: {
    guestId: string;
  };
  mediaFileUrls: string[];
  youtubeUrls: string[];
  likesCount: number;
  commentsCount: number;
  shareCount: number;
  isLike: boolean; // 이 줄을 추가
  isShare: boolean;
}