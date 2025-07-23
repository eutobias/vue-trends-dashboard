export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");
  const trends = {
    "6": {
      current: {
        average: 11,
        top_3_position: 29.67,
        top_3_percentage: 65.02,
        market_share_position: 15,
        market_share_percentage: 73.67,
      },
      previous: {
        average: 5,
        execution_date: "2025-04-08T13:48:01.000000Z",
        top_3_position: 39,
        top_3_percentage: 13.77,
        market_share_position: 18,
        market_share_percentage: 57,
      },
    },
    "7": {
      current: {
        average: 13,
        top_3_position: 25.12,
        top_3_percentage: 70.11,
        market_share_position: 12,
        market_share_percentage: 80.23,
      },
      previous: {
        average: 7,
        execution_date: "2025-04-08T13:48:01.000000Z",
        top_3_position: 35.5,
        top_3_percentage: 20.45,
        market_share_position: 14,
        market_share_percentage: 60.5,
      },
    },
    "8": {
      current: {
        average: 9,
        top_3_position: 31.8,
        top_3_percentage: 60.5,
        market_share_position: 17,
        market_share_percentage: 70.2,
      },
      previous: {
        average: 4,
        execution_date: "2025-04-08T13:48:01.000000Z",
        top_3_position: 41.2,
        top_3_percentage: 15.3,
        market_share_position: 20,
        market_share_percentage: 55.7,
      },
    },
  };

  if (!Object.keys(trends).includes(id))
    throw createError({
      statusCode: 404,
      message: "Trends not found",
    });

  return trends[id];
});
