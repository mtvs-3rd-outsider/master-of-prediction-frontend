import axios from '@handler/fetch/axios';
import { FeedsResponseDTO } from '@components/types/feedsResponseDTO';

interface PageResponse<T> {
  content: T[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
export const getChannelFeeds = async (
  channelType: string,
  channelId: number,
  page: number = 0,
  size: number = 10
): Promise<PageResponse<FeedsResponseDTO>> => {
    // channelType을 대문자로 변환
    const type = channelType.toUpperCase();
    
    const response = await axios.get(`/myfeeds/${type}/${channelId}`, {
      params: {
        page,
        size,
        sort: 'shortAt,DESC'  // 서버와 일치하도록 수정
      }
    });
    return response.data;
  
};