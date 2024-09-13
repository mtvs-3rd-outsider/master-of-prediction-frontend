export interface HotTopicFeedResponseDTO {
  id: number;
  authorType: 'USER' | 'GUEST';
  title: string;
  content: string;
  createdAt: string;  // LocalDateTime -> string으로 변경
  updatedAt: string;
  viewCount: number;
  channelType: 'MYCHANNEL' | 'CATEGORYCHANNEL';
  user?: {
    userId: string;
    userName: string;
    userImg: string;
  };
  guest?: {
    guestId: string;
  };
  mediaFileUrls: string[];
  youtubeUrls: string[]; 
  likesCount: number;
  commentsCount: number;
  quoteCount: number;
}
