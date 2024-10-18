import apiClient from "./fetch/axios";

export const fetchSearchResults = async (pageParam:number ,queryKey: string[]) => {
    const response = await apiClient.get(`/search/user/displayName`,{
      params: { 
        q: queryKey[1],
        page: pageParam,
        size: 5,
        }} );
    return response.data;
  };