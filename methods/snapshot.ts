import Bar from "../Bar.ts";

async function snapshot(symbol: string) {
  const bars = new Bar(symbol);
  const data = {
    symbol: symbol,
    trend: {
      SMA: {
        "5": (await bars.movingAverage(5)).mean,
        "9": (await bars.movingAverage(9)).mean,
        "50": (await bars.movingAverage(50)).mean,
        "200": (await bars.movingAverage(200)).mean,
      },
      EMA: {
        "5": await bars.exponentialMovingAverage(5),
        "9": await bars.exponentialMovingAverage(9),
        "50": await bars.exponentialMovingAverage(50),
        "200": await bars.exponentialMovingAverage(200),
      },
    },
    bollinger_band: {
      band_width: (await bars.bollingerBand(20)).bandWidth,
      bb_trend: await bars.bollingerBandTrend(),
      signal: (await bars.bollingerBandTrend()) > 0 ? "Bull" : "Bear",
    },
    stochastics: {
      k_line: (await bars.stochastic(14)).kLine,
      d_line: (await bars.stochastic(14)).dLine,
      d_slow_line: (await bars.stochastic(14)).dSlowLine,
    },
  };

  return data;
}

export default snapshot;
