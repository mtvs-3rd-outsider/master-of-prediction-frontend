export interface BettingProductType {
    userID: number;
    userName: string;
    displayName: string;
    tierName: string;
    userImg: string;
    title: string;
    imgUrls: string[];
    bettingId: number;
    blindName: string | null;
    quoteCount?: number;
  }
  
  // 필요한 경우 추가 타입도 정의할 수 있습니다
  export interface BettingListResponse {
    content: BettingProductType[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
      };
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  }