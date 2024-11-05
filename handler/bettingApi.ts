import axios from '@handler/fetch/axios';
import { BettingProductType } from '@/types/BettingTypes';

export const getBettingById = async (bettingId: number): Promise<BettingProductType> => {
  try {
    const response = await axios.get(`/betting-products/${bettingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching betting:', error);
    throw error;
  }
};

// 만약 배팅 전체 목록을 가져오는 API가 필요하다면
export const getBettingList = async (page: number = 0, size: number = 10) => {
  try {
    const response = await axios.get('/betting-products', {
      params: {
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching betting list:', error);
    throw error;
  }
};