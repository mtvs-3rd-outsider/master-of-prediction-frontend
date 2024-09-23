export interface BettingActivityType {
  userName: string;
  displayName: string;
  tierName: string;
  userImg: string;
  point: number;
  orderDate: string;
  orderTime: string;
  content: string;
  imgUrl: string;
}

export interface TopHolderType {
  userName: string;
  displayName: string | null;
  tierName: string;
  userImg: string | null;
  point: number;
  bettingOptionId: number;
}

export type BettingTopHolders = Record<number, TopHolderType[]>;
