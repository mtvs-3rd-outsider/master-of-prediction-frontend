// @handler/hotTopicApi.ts

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

export const getHotTopicFeeds = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'viewCount,DESC'
): Promise<PageResponse<FeedsResponseDTO>> => {
  try {
    const response = await axios.get('/feeds/hot-topic', { // '/api/v1/' 부분 제거
      params: { page, size, sort }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching hot topic feeds:', error);
    throw error;
  }
};