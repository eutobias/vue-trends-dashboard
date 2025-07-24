export interface TrendsHistoryResponse {
    history: TrendHistory[];
}

export interface TrendHistory {
    execution_date:          Date;
    average:                 number;
    top_3_position:          number;
    top_3_percentage:        number;
    market_share_position:   number;
    market_share_percentage: number;
    keywords:                string[];
}
