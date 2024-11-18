import axios from '@handler/fetch/axios';

interface PageResponse<T> {
    content: T[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }

export const getChannel = async (

): Promise<PageResponse<ChannelTypeDTO>>=>{

};