# Bronson

Technical indicator snpashot software.

## Trend

```js
trend: {
    SMA: { "5": 73.054, "9": 74.132, "50": 74.355, "200": 71.634 },
    EMA: { "5": 72.63, "9": 73.58, "50": 74.45, "200": 72.2 }
  }
```

### <b>SMA - Simple Moving Average</b>

> "days": average

This is the average of the close prices for the time period (days).

### <b>EMA - Exponential Moving Average</b>

> "days": average

This is the average of the close prices for the time period (days), but with a greater weight on the most recent prices.

## Bollinger Band (Mean Reversion)

```js
  bollinger_band: {
    band_width: [
      0.07, 0.07, 0.07, 0.06,
      0.06, 0.06, 0.06, 0.06,
      0.06, 0.06, 0.06, 0.06,
      0.06, 0.06, 0.06, 0.06,
      0.06, 0.06, 0.07, 0.08
    ],
    bb_trend: 0.03,
    signal: "Bull"
  }
```

### <b>Band Width</b>

> "band_width": [width, width, width, ...]

This is the gap between the upper and lower bollinger bands, divided by the SMA of the period (20day). The smaller the number, the closer the "Squeeze" and contraction.

### <b>BBTrend</b>

> "bb_trend": trend number

This takes Bollinger band(20) and Bollinger band(50), then subracts their most recent plot points bb[20] - bb[50], and finally dividing that by the SMA(20). This will be a leading indicator for a Bull or Bear signal. Over 0 is bull, under 0 is bear.

## Stochastics (Relative Strength)

```js
  stochastics: {
    k_line: [
      87.96, 85.85, 96.36,   100,
        100,   100, 85.95,   100,
      58.79,     0, 13.89, 17.86,
          0,     0,     0
    ],
    d_line: [
      90.06, 94.07, 98.79,
        100, 95.32, 95.32,
      81.58, 52.93, 24.23,
      10.58, 10.58,  5.95,
          0
    ],
    d_slow_line: [
      94.31, 97.62, 98.04,
      96.88, 90.74, 76.61,
      52.91, 29.25, 15.13,
       9.04,  5.51
    ]
  }
```

### <b>%K line</b>

> "k_line": [k, k, k, k...]

Plot points for the scholastic oscillator. This helps to determine if a stock is over bought or over sold. The range is 0 - 100. Anything above 80 is considered over bought, and is a leading indicator to sell. Under 20 is over sold, indicating a buy.

### <b>%D line</b>

> "d_line": [d, d, d, d...]

This is the average of the k line plots over a 3 day period. Considered a better indicator than k when looking for a turn around point and entry/exit timing.

### <b>%D slow line</b>

> "d_slow_line": [d, d, d, d...]

This is the average of the d line plots over a 3 day period. This is used to reinforce the confirmation of a turnaround and entry/exit point.

## MACD - Moving Average Convergence Divergence

```js
macd_line: [-0.34, -0.4, -0.6, -0.89, -1.15],
signal_line: []
```

### <b>macd_line</b>

> "macd_line": [diff off baseline, diff off baseline, ... ]

This is the EMA(12) - EMA(26). With 0 as the baseline, anything under is considered oversold, above is overbought.

### <b>signal_line</b>

> "signal_line": [diff off baseline, diff off baseline, ... ]

This is the EMA(9) of the macd_line, only for the current day. This could be a leading indicator, when and if the signal line is crossed by the macd_line. If the last value of the macd_line is close to the signal_line, a swing up or down may be coming.
