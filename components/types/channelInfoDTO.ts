export interface ChannelInfo {
    displayName: string;
    channelName?: string;  // 백엔드에서 다른 필드명을 사용할 수 있으므로 추가
    channelId: number;
    description?: string;
    imageUrl?: string;
    userCount?: number;

}
