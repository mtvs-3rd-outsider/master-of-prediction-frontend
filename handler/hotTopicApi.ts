import axios from '@handler/fetch/axios';
import { HotTopicFeedResponseDTO } from '@components/types/feed';

export const getInitialHotTopicFeeds = async (size: number = 10): Promise<HotTopicFeedResponseDTO[]> => {
  const response = await axios.get(`/feeds/hot-topic?size=${size}`);
  return response.data;
};

export const getNextHotTopicFeeds = async (lastId: number, size: number = 10): Promise<HotTopicFeedResponseDTO[]> => {
  const response = await axios.get(`/feeds/hot-topic/next?lastId=${lastId}&size=${size}`);
  return response.data;
};