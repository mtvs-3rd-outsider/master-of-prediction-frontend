import axios from '@handler/fetch/axios';
import { FeedResponseDTO } from '@components/types/feedResponseDTO';

export const getFeedById = async (feedId: number): Promise<FeedResponseDTO> => {
  try {
    const response = await axios.get(`/feeds/${feedId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feed:', error);
    throw error;
  }
};

export const getInitialHotTopicFeeds = async (size: number = 10): Promise<FeedResponseDTO[]> => {
  try {
    const response = await axios.get(`/feeds/hot-topic?size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching initial hot topic feeds:', error);
    throw error;
  }
};

export const getNextHotTopicFeeds = async (lastId: number, size: number = 10): Promise<FeedResponseDTO[]> => {
  try {
    const response = await axios.get(`/feeds/hot-topic/next?lastId=${lastId}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching next hot topic feeds:', error);
    throw error;
  }
};