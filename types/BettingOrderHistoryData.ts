export interface BettingOrderStatisticsDTO {
  orderDate: string;
  orderTime: string;
  bettingOptionId: number;
  totalPoints: number;
  ratio: number;
}

export interface BettingOrderHistoryData {
  lastHour: BettingOrderStatisticsDTO[];
  last6Hour: BettingOrderStatisticsDTO[];
  oneDay: BettingOrderStatisticsDTO[];
  oneWeek: BettingOrderStatisticsDTO[];
  oneMonth: BettingOrderStatisticsDTO[];
  all: BettingOrderStatisticsDTO[];
}

export interface BettingOrderHistoryDataArray {
  [key: string]: BettingOrderStatisticsDTO[];
}
