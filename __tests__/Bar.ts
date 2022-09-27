import { assertEquals } from "https://deno.land/std@0.156.0/testing/asserts.ts";
import Bar from "../lib/Bar.ts";

Deno.test(".movingAverage", async () => {
  const mockData = [
    17.76, 17.48, 16.65, 17.7, 17.21, 17.49, 18.01, 18.85, 19.25, 18.78,
  ];
  const bar = new Bar("AAPL");
  await bar.init(mockData);

  const mean = bar.movingAverage(mockData.length);
  assertEquals(mean?.mean, 17.918);
});

Deno.test(".exponentialMovingAverage", async () => {
  const mockData = [
    17.76, 17.48, 16.65, 17.7, 17.21, 17.49, 18.01, 18.85, 19.25, 18.78,
  ];

  const bar = new Bar("AAPL");
  await bar.init(mockData);

  const mean = bar.exponentialMovingAverage(mockData.length);
  assertEquals(mean, 18.16);
});

Deno.test(".standardDeviation", async () => {
  const mockData = [
    53.73, 53.87, 53.85, 53.88, 54.08, 54.14, 54.5, 54.3, 54.4, 54.16,
  ];

  const bar = new Bar("AAPL");
  await bar.init();
  const deviation = bar.calcStandardDeviation(mockData);

  assertEquals(deviation, 0.2440286868382486);
});

Deno.test(".bollingerBand", async () => {
  const mockData = [
    53.73, 53.87, 53.85, 53.88, 54.08, 54.14, 54.5, 54.3, 54.4, 54.16,
  ];

  const bar = new Bar("AAPL");
  await bar.init(mockData);
  const band = bar.bollingerBand(5);

  assertEquals(band?.bandWidth, [0.01, 0.01, 0.02, 0.02, 0.01]);
});
Deno.test(".stochastic", async () => {
  const mockData = [
    24.49, 24.51, 22.54, 22.64, 23.54, 27.01, 27.25, 26.66, 29.14, 29.68, 29.15,
    28.55, 28.82, 28.67, 29.42, 30.19, 30.21, 30.29, 29.78, 30.47, 28.9, 27.95,
    28.3, 28.4, 27.45, 27.01, 25.29, 25.095,
  ];

  const bar = new Bar("AAPL");
  await bar.init(mockData);
  const stochastics = bar.stochastic(14);

  assertEquals(
    stochastics?.kLine,
    [
      85.85, 96.36, 100, 100, 100, 85.95, 100, 58.79, 0, 13.89, 17.86, 0, 0, 0,
      0,
    ]
  );

  assertEquals(
    stochastics?.dLine,
    [
      94.07, 98.79, 100, 95.32, 95.32, 81.58, 52.93, 24.23, 10.58, 10.58, 5.95,
      0, 0,
    ]
  );

  assertEquals(
    stochastics?.dSlowLine,
    [97.62, 98.04, 96.88, 90.74, 76.61, 52.91, 29.25, 15.13, 9.04, 5.51, 1.98]
  );
});

Deno.test(".MACD", async () => {
  const data = [
    25.1, 25.48, 25.34, 25.46, 25.04, 25.54, 24.49, 24.51, 22.54, 22.64, 23.54,
    27.01, 27.25, 26.66, 29.14, 29.68, 29.15, 28.55, 28.82, 28.67, 29.42, 30.19,
    30.21, 30.29, 29.78, 30.47, 28.9, 27.95, 28.3, 28.4, 27.45, 27.01, 25.29,
    25.12, 26.485,
  ];

  const bar = new Bar("AAPL");
  await bar.init(data);
  const macd = bar.MACD();

  assertEquals(
    macd?.macdLine,
    [1.68, 1.39, 1.21, 1.11, 0.92, 0.75, 0.39, 0.03, -0.25]
  );

  assertEquals(macd?.signal_line, 0.6);
});
