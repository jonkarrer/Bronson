import { assertEquals } from "https://deno.land/std@0.156.0/testing/asserts.ts";
import Bar from "../Bar.ts";

Deno.test(".movingAverage", async () => {
  const mockData = [
    17.76, 17.48, 16.65, 17.7, 17.21, 17.49, 18.01, 18.85, 19.25, 18.78,
  ];
  const mean = await new Bar("AAPL").movingAverage(mockData.length, mockData);
  assertEquals(mean.mean, 17.92);
});

Deno.test(".exponentialMovingAverage", async () => {
  const mockData = [
    17.76, 17.48, 16.65, 17.7, 17.21, 17.49, 18.01, 18.85, 19.25, 18.78,
  ];
  const mean = await new Bar("AAPL").exponentialMovingAverage(
    mockData.length,
    mockData
  );
  assertEquals(mean, 18.16);
});

Deno.test(".bollingerBand", async () => {
  const mockData = [
    53.73, 53.87, 53.85, 53.88, 54.08, 54.14, 54.5, 54.3, 54.4, 54.16,
  ];

  const band = await new Bar("AAPL").bollingerBand(mockData);

  assertEquals(band, 0.24);
});
