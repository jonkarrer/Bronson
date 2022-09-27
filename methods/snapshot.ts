import Bar from "../Bar.ts";

async function snapshot(symbol: string) {
  const bars = new Bar(symbol);
  await bars.init();
  const data = {
    symbol: symbol,
    trend: {
      SMA: {
        "5": bars.movingAverage(5)?.mean,
        "9": bars.movingAverage(9)?.mean,
        "50": bars.movingAverage(50)?.mean,
        "200": bars.movingAverage(200)?.mean,
      },
      EMA: {
        "5": bars.exponentialMovingAverage(5),
        "9": bars.exponentialMovingAverage(9),
        "50": bars.exponentialMovingAverage(50),
        "200": bars.exponentialMovingAverage(200),
      },
    },
    mean_reversion: {
      bollinger_band: {
        band_width: bars.bollingerBand(20)?.bandWidth,
        bb_trend: bars.bollingerBandTrend(),
      },
    },
    relative_strength: {
      stochastics: {
        k_line: bars.stochastic(14)?.kLine,
        d_line: bars.stochastic(14)?.dLine,
        d_slow_line: bars.stochastic(14)?.dSlowLine,
      },
    },
    momentum: {
      macd_line: bars.MACD()?.macdLine,
      signal_line: bars.MACD()?.signal_line,
    },
  };

  return data;
}

export default snapshot;
