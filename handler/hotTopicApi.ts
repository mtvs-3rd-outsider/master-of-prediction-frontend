import axios from '@handler/fetch/axios';
import { HotTopicFeedResponseDTO } from '@components/types/feed';

interface PageResponse<T> {
  content: T[];
  last: boolean;
  totalElements: number;
  totalPages: number;
}

export const getHotTopicFeeds = async (page: number = 0, size: number = 10, sort: string = 'createdAt,DESC'): Promise<PageResponse<HotTopicFeedResponseDTO>> => {
  const response = await axios.get(`/feeds/hot-topic?page=${page}&size=${size}&sort=${sort}`);
  return response.data;
};