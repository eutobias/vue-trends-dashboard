export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");
  const trendsHistory = {
    "6": {
      history: [
        {
          execution_date: "2025-04-09T13:48:01.000000Z",
          average: 11,
          top_3_position: 29.67,
          top_3_percentage: 65.02,
          market_share_position: 15,
          market_share_percentage: 73.67,
          keywords: ["library", "bookkeeping", "book keepers"],
        },
        {
          execution_date: "2025-04-08T13:48:01.000000Z",
          average: 5,
          top_3_position: 39,
          top_3_percentage: 13.77,
          market_share_position: 18,
          market_share_percentage: 57,
          keywords: ["library", "bookkeeping", "book keepers"],
        },
        {
          execution_date: "2025-04-07T13:48:01.000000Z",
          average: 5.333333333333333,
          top_3_position: 30.67,
          top_3_percentage: 8.81,
          market_share_position: 10,
          market_share_percentage: 68.67,
          keywords: ["library", "bookkeeping", "book keepers"],
        },
      ],
    },
    "7": {
      history: [
        {
          execution_date: "2025-04-09T13:48:01.000000Z",
          average: 13,
          top_3_position: 25.12,
          top_3_percentage: 70.11,
          market_share_position: 12,
          market_share_percentage: 80.23,
          keywords: ["finance", "accounting", "tax"],
        },
        {
          execution_date: "2025-04-08T13:48:01.000000Z",
          average: 7,
          top_3_position: 35.5,
          top_3_percentage: 20.45,
          market_share_position: 14,
          market_share_percentage: 60.5,
          keywords: ["finance", "accounting", "tax"],
        },
        {
          execution_date: "2025-04-07T13:48:01.000000Z",
          average: 6.1,
          top_3_position: 28.9,
          top_3_percentage: 10.2,
          market_share_position: 9,
          market_share_percentage: 65.1,
          keywords: ["finance", "accounting", "tax"],
        },
      ],
    },
    "8": {
      history: [
        {
          execution_date: "2025-04-09T13:48:01.000000Z",
          average: 9,
          top_3_position: 31.8,
          top_3_percentage: 60.5,
          market_share_position: 17,
          market_share_percentage: 70.2,
          keywords: ["software", "development", "coding"],
        },
        {
          execution_date: "2025-04-08T13:48:01.000000Z",
          average: 4,
          top_3_position: 41.2,
          top_3_percentage: 15.3,
          market_share_position: 20,
          market_share_percentage: 55.7,
          keywords: ["software", "development", "coding"],
        },
        {
          execution_date: "2025-04-07T13:48:01.000000Z",
          average: 5.7,
          top_3_position: 34.1,
          top_3_percentage: 9.5,
          market_share_position: 11,
          market_share_percentage: 66.8,
          keywords: ["software", "development", "coding"],
        },
      ],
    },
  };

  if (!Object.keys(trendsHistory).includes(id))
    throw createError({
      statusCode: 404,
      message: "Trends not found",
    });

  return trendsHistory[id];
});
