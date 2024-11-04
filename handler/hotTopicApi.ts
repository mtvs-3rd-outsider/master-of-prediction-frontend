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

// 조회수 기준 정렬
export const getHotTopicFeeds = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'viewCount,DESC'
): Promise<PageResponse<FeedsResponseDTO>> => {
  try {
    const response = await axios.get('/feeds/hot-topic', {
      params: { page, size, sort }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching hot topic feeds:', error);
    throw error;
  }
};

// 최신순 정렬
export const getHomeTopicFeeds = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'shortAt,DESC'
): Promise<PageResponse<FeedsResponseDTO>> => {
  try {
    const response = await axios.get('/feeds/home', {
      params: { page, size, sort }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching home topic feeds:', error);
    throw error;
  }
};

// 좋아요순 정렬
export const getLikeFeeds = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'likesCount,DESC'
): Promise<PageResponse<FeedsResponseDTO>> => {
  try {
    const response = await axios.get('/feeds/like', {
      params: { page, size, sort }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching like sorted feeds:', error);
    throw error;
  }
};