import Bar from "../Bar.ts";

async function snapshot(symbol: string) {
  const bars = new Bar(symbol);
  const data = {
    symbol: symbol,
    moving_day_averages: {
      "5": await bars.movingDayAverage(5),
      "9": await bars.movingDayAverage(9),
      "50": await bars.movingDayAverage(50),
      "200": await bars.movingDayAverage(200),
    },
  };

  return data;
}

export default snapshot;
