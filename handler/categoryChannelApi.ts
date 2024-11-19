import axios from '@handler/fetch/axios';
import { ChannelInfo } from '@components/types/';

export const getChannelById = async (channelId: string): Promise<ChannelInfo> => {
  const response = await axios.get(`/category-channels/${channelId}`);
  return response.data;
};