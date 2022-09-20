import { assertEquals } from "https://deno.land/std@0.156.0/testing/asserts.ts";
import Bar from "../Bar.ts";

Deno.test(".movingAverage", async () => {
  const mockData = [
    17.76, 17.48, 16.65, 17.7, 17.21, 17.49, 18.01, 18.85, 19.25, 18.78,
  ];
  const mean = await new Bar("SD").movingAverage(mockData.length, mockData);
  assertEquals(mean, 17.92);
});

Deno.test(".exponentialMovingAverage", async () => {
  const mockData = [
    17.76, 17.48, 16.65, 17.7, 17.21, 17.49, 18.01, 18.85, 19.25, 18.78,
  ];
  const mean = await new Bar("SD").exponentialMovingAverage(
    mockData.length,
    mockData
  );
  assertEquals(mean, 18.16);
});
