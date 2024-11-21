import apiClient from "./fetch/axios";

// Fetch followers
export const fetchFollowers = async (pageParam = 0, queryKey: string[]) => {
  const channelId = queryKey[1];
  const response = await apiClient.get(
    `/subscriptions/channel/${channelId}/subscribers`,
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
        flag: "ALL"

      },
    }
  );
  console.log(response.data)
  return response.data;
};
