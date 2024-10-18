// @components/types/feedResponseDTO.ts

export type AuthorType = 'USER' | 'GUEST';

export interface FeedsResponseDTO {
    id: number;
    authorType: AuthorType;
    title: string;
    content: string;
    createdAt: string; // LocalDateTime을 string으로 표현
    updatedAt: string; // LocalDateTime을 string으로 표현
    viewCount: number;
    user: UserDTO | null;
    guest: GuestDTO | null;
    isLike: boolean | null;
    mediaFileUrls: string[];
    youtubeUrls: string[];
    likesCount: number;
    commentsCount: number;
    quoteCount: number;
}

export interface UserDTO {
    id: number;
    userName: string;
    displayName: string;
    points: string; // BigDecimal을 string으로 표현
    authority: Authority;
    tier: Tier;
    userImg: string;
}

export interface GuestDTO {
    guestId: string;
    guestPassword: string;
}

export interface ChannelDTO {
    channelId: number;
    channelType: ChannelType;
}

// Enum 타입들
export type Authority = string; // 실제 Authority enum 값들로 대체 가능
export type Tier = string; // 실제 Tier enum 값들로 대체 가능
export type ChannelType = 'MYCHANNEL' | 'CATEGORYCHANNEL'; // 예시, 실제 값들로 대체 필요