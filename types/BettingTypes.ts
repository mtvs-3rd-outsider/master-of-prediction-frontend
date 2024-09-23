export interface BettingCreater {
  userID: number;
  userName: string;
  displayName: string;
  tierName: string;
  userImg: string;
}

// 상품 정보 타입 정의
export interface BettingProduct {
  deadlineDate: string;
  deadlineTime: string;
  isBlind: boolean;
  title: string;
  content: string;
  userId: number;
}

// 옵션 타입 정의
export interface BettingOptions {
  optionId: number;
  content: string;
  imgUrl: string;
}

// 전체 데이터 타입 정의
export interface BettingProductInfo {
  user: BettingCreater;
  product: BettingProduct;
  productImages: string[];
  options: BettingOptions[];
  optionsRatio: OptionsRatio[];
}

export interface BettingProductType {
  userID: number;
  userName: string;
  displayName: string;
  tierName: string;
  userImg: string;
  title: string;
  imgUrls: string[];
  bettingId: number;
}

export interface OptionsRatio {
  bettingOptionId: number;
  totalPoints: number;
  percentage: string;
}
