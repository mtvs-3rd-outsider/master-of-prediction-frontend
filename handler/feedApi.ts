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
