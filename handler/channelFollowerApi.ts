import axios from '@handler/fetch/axios';
import { ChannelInfo } from '@components/types/channelInfoDTO';

interface FollowingResponse {
  content: ChannelInfo[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const getFollowingChannels = async (userId: number): Promise<FollowingResponse> => {
  const response = await axios.get(`/subscriptions/user/${userId}/following`, {
    params: {
      isUserChannel: true,
      page: 0,
      size: 15,
    },
  });
  return response.data;
};