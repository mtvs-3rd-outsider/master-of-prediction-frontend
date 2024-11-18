import apiClient from "./fetch/axios";

apiClient
// Fetch followings
export const fetchFollowings = async (pageParam = 0, queryKey: string[]) => {
    const channelId = queryKey[1];
    const response = await apiClient.get(
      `/subscriptions/user/${channelId}/following`,
      {
        params: {
          isUserChannel: true,
          page: pageParam,
          size: 15,
        },
      }
    );
    return response.data;
  };