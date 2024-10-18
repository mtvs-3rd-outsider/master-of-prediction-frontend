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
  size: number = 10,
  sort: string = 'createdAt,DESC'
): Promise<PageResponse<FeedsResponseDTO>> => {
  try {
    const response = await axios.get(`/myfeeds/${channelType}/${channelId}`, {
      params: { page, size, sort }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching channel feeds:', error);
    throw error;
  }
};