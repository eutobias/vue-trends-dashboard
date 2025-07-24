export interface TrendsResponse {
  current: Trend;
  previous: Trend;
}

export interface Trend {
  average: number;
  top_3_position: number;
  top_3_percentage: number;
  market_share_position: number;
  market_share_percentage: number;
  execution_date?: Date;
}
