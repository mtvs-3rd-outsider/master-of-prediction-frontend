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

// 기본 API 호출 함수
const fetchFeeds = async (
  endpoint: string,
  page: number = 0,
  size: number = 10,
  sort?: string
): Promise<PageResponse<FeedsResponseDTO>> => {
  try {
    const response = await axios.get(endpoint, {
      params: { 
        page, 
        size, 
        sort,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching feeds:', error);
    throw error;
  }
};

// 조회수 기준 정렬
export const getHotTopicFeeds = async (
  page: number = 0,
  size: number = 10
): Promise<PageResponse<FeedsResponseDTO>> => {
  return fetchFeeds('/feeds/hot-topic', page, size, 'viewCount,DESC');
};

// 최신순 정렬
export const getHomeTopicFeeds = async (
  page: number = 0,
  size: number = 10
): Promise<PageResponse<FeedsResponseDTO>> => {
  return fetchFeeds('/feeds/home', page, size, 'shortAt,DESC');
};

// 좋아요순 정렬
export const getLikeFeeds = async (
  page: number = 0,
  size: number = 10
): Promise<PageResponse<FeedsResponseDTO>> => {
  return fetchFeeds('/feeds/like', page, size, 'likesCount,DESC');
};

// 팔로우한 채널의 피드 조회
export const getFollowingFeeds = async (
  page: number = 0,
  size: number = 10
): Promise<PageResponse<FeedsResponseDTO>> => {
  return fetchFeeds('/feeds/following', page, size);
};