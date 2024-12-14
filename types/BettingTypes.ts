import { ChannelDTO, ChannelType } from "@components/types/feedResponseDTO";

export interface BettingCreater {
  userID: number;
  userName: string;
  displayName: string;
  tierName: string;
  userImg: string;
  isAdmin?: boolean;
}

// 상품 정보 타입 정의
export interface BettingProduct {
  deadlineDate: string;
  deadlineTime: string;
  isBlind: boolean;
  title: string;
  content: string;
  userId: number;
  blindName: string;
  winningOption: number | null;
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
  postStats: PostStatsNavState;
  isWriter: Boolean;
  isAdmin: Boolean;
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
  blindName: string | null;
  postStats: null | PostStatsNavState;
  createdAt: string;
  channel?: ChannelDTO;
  isAdmin: boolean;
}

export interface OptionsRatio {
  bettingOptionId: number;
  totalPoints: number;
  percentage: string;
}

export interface PostStatsNavState {
  id: number;
  viewCount: string;
  commentsCount: number;
  shareCount: number;
  feedId: string;
  isShare: boolean;
  isLike: boolean;
  likesCount: number;
}
