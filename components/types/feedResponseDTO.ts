// @components/types/feedResponseDTO.ts
// @components/types/feedResponseDTO.ts

import { TierDTO } from "./feedsResponseDTO";


export type AuthorType = 'USER' | 'GUEST';
export type ChannelType = 'MYCHANNEL' | 'CATEGORYCHANNEL';

// 공통 UserDTO
export interface UserDTO {
  userId: number;
  userName: string;
  displayName: string;
  points: string;
  authority: string;
  tier: TierDTO;
  userImg: string;
}

export interface GuestDTO {
  guestId: string;
  guestPassword: string;
}

export interface ChannelDTO{
  channelId: number;
  channelName: string;
  channelType: ChannelType;
}

// 상세 피드 조회용 DTO
export interface FeedResponseDTO {
  id: number;
  authorType: AuthorType;
  content: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  channelType: ChannelType;
  user?: UserDTO;
  guest?: GuestDTO;
  mediaFiles: Array<{
    id: number;
    fileUrl: string;
  }>;
  youTubeVideos: Array<{
    id: number;
    youtubeUrl: string;
  }>;
  commentDTOS: Array<CommentDTO>;
  replyDTOS: Array<ReplyDTO>;
  likesCount: number;
  commentsCount: number;
  shareCount: number;
  isLike: boolean;
  isShare: boolean;
  quoteFeed?: QuoteFeed;
  isQuote: boolean;
  channel: ChannelDTO;
}

export interface QuoteFeed {
  quoteId: number;
  quoteContent: string;
  quoteCreateAt: string;
  quoteUser: UserDTO;
  quoteGuest: GuestDTO;
  mediaFileUrls: string[];
  youtubeUrls: string[];
}

  // CommentDTO와 ReplyDTO는 이전과 동일
  interface CommentDTO {
    id: number;
    content: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    replies?: CommentDTO[];
  }
  
  interface ReplyDTO {
    id: number;
    content: string;
    userId: number;
    commentId: number;
    createdAt: string;
    updatedAt: string;
  }