import { assertEquals } from "https://deno.land/std@0.156.0/testing/asserts.ts";
import Bar from "../Bar.ts";

Deno.test(".movingAverage", async () => {
  const mockData = [
    17.76, 17.48, 16.65, 17.7, 17.21, 17.49, 18.01, 18.85, 19.25, 18.78,
  ];
  const bar = new Bar("AAPL");
  await bar.init();

  const mean = bar.movingAverage(mockData.length, mockData);
  assertEquals(mean?.mean, 17.918);
});

Deno.test(".exponentialMovingAverage", async () => {
  const mockData = [
    17.76, 17.48, 16.65, 17.7, 17.21, 17.49, 18.01, 18.85, 19.25, 18.78,
  ];

  const bar = new Bar("AAPL");
  await bar.init();

  const mean = bar.exponentialMovingAverage(mockData.length, mockData);
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
  await bar.init();
  const band = bar.bollingerBand(5, mockData);

  assertEquals(band?.bandWidth, [0.01, 0.01, 0.02, 0.02, 0.01]);
});
