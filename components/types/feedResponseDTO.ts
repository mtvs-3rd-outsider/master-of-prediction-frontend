// @components/types/feedResponseDTO.ts
// @components/types/feedResponseDTO.ts

export interface FeedResponseDTO {
    id: number;
    authorType: 'USER' | 'GUEST';
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    viewCount: number;
    channelType: 'MYCHANNEL' | 'CATEGORYCHANNEL';
    user?: UserDTO;
    guest?: {
      guestId: string;
    };
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
    quoteCount: number;
    isLike: boolean; // 이 줄을 추가
  }
  
  export interface UserDTO {
    userId: number;
    userName: string;
    displayName: string;
    points: number;
    authority: string;
    tier: string;
    userImg: string;
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