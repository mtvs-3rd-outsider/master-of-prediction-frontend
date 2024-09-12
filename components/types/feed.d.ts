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
      userId: string;
      userName: string;
      userImg: string;
    };
    guest?: {
      guestId: string;
    };
    imageFiles: { imageUrl: string }[];
    youTubeVideos: { youtubeUrl: string }[];
    likesCount: number;
    commentsCount: number;
    quoteCount: number;
  }