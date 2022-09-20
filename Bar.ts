import "https://deno.land/std@0.156.0/dotenv/load.ts";

type Bars = {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  n: number;
  vw: number;
};
type BarsResponse = {
  bars: Array<Bars>;
  symbol: "SD";
  next_page_token: string | null;
};
export default class Bar {
  baseUrl: string;
  options: {
    method: string;
    headers: {
      [index: string]: string | undefined;
    };
  };
  constructor(symbol: string) {
    this.baseUrl = `https://data.alpaca.markets/v2/stocks/${symbol}/bars`;
    this.options = {
      method: "GET",
      headers: {
        "APCA-API-KEY-ID": Deno.env.get("ALPACA_API_KEY_ID"),
        "APCA-API-SECRET-KEY": Deno.env.get("ALPACA_SECRET_KEY"),
      },
    };
  }

  async request(query: string, options = this.options) {
    const url = this.baseUrl + `?${query}`;
    try {
      const request = await fetch(url, options as any);
      const response = await request.json();
      return response;
    } catch (error) {
      console.log("error", error);
    }
  }

  async monthly(timeframe: number, numOfMonths: number) {
    const data = await this.request(
      `timeframe=${timeframe}Month&start=${this.subtractMonths(numOfMonths)}`
    );

    return data;
  }

  async weekly(weeks: number) {
    const days = weeks * 7;
    const data = await this.request(
      `timeframe=1Week&start=${this.subtractDays(days)}`
    );

    return data;
  }

  async daily(days: number): Promise<BarsResponse> {
    const data = await this.request(
      `timeframe=1Day&start=${this.subtractDays(days)}`
    );

    return data;
  }

  async hour(timeframe: number, days: number) {
    const data = await this.request(
      `timeframe=${timeframe}Hour&start=${this.subtractDays(days)}`
    );

    return data;
  }

  async minute(timeframe: number, days: number) {
    const data = await this.request(
      `timeframe=${timeframe}Min&start=${this.subtractDays(days)}`
    );

    return data;
  }

  async movingAverage(
    days: number,
    dataSet: Array<number> | undefined = undefined
  ): Promise<number> {
    // * Overshoot timeframe by * 2 to get a data set of the correct length.
    const closePricesInTimeframe =
      dataSet ?? (await this.daily(days * 2)).bars.map((item) => item.c);

    // * Trim overshoot to be the correct sized timeframe. 10 days, 50 days, etc..
    const targetPrices = closePricesInTimeframe.splice(
      closePricesInTimeframe.length - days
    );

    // * Calculate the mean of the price points
    const sumOfPrices = targetPrices.reduce((prev, curr) => {
      return prev + curr;
    });
    const amountOfPrices = targetPrices.length;
    const average = sumOfPrices / amountOfPrices;

    return Math.round((average + Number.EPSILON) * 100) / 100;
  }

  async exponentialMovingAverage(
    days: number,
    dataSet: Array<number> | undefined = undefined
  ) {
    // * Overshoot timeframe by * 2 to get a data set of the correct length.
    const closePricesInTimeframe =
      dataSet ?? (await this.daily(days * 3)).bars.map((item) => item.c);

    // * Trim overshoot to be the correct sized timeframe. 10 days, 50 days, etc..
    const targetPrices = closePricesInTimeframe.slice(
      closePricesInTimeframe.length - days
    );

    // * Get the first half of the range to calculate the first EMA with the SMA of timeframe.
    const simpleAveragePriceRange = targetPrices.slice(0, days / 2);

    const exponentialAveragePriceRange = targetPrices.slice(days / 2);

    // * Get the SMA for the timeframe
    const sumOfSimplePriceRange = simpleAveragePriceRange.reduce(
      (prev, curr) => {
        return prev + curr;
      }
    );
    const amountOfPricesInRange = simpleAveragePriceRange.length;
    const meanOfSimplePrices = sumOfSimplePriceRange / amountOfPricesInRange;
    const simpleMovingAverage =
      Math.round((meanOfSimplePrices + Number.EPSILON) * 100) / 100;

    // * Start the EMA calculation
    const multiplier = 2 / (days + 1);

    // * Put the SMA of the previous days into the first index of the EMA data set.
    exponentialAveragePriceRange.splice(0, 0, simpleMovingAverage);

    const ema = exponentialAveragePriceRange.reduce((prev, curr) => {
      const algo = curr * multiplier + prev * (1 - multiplier);

      return algo;
    });

    return Math.round((ema + Number.EPSILON) * 100) / 100;
  }

  subtractDays(numOfDays: number, date = new Date()) {
    date.setDate(date.getDate() - numOfDays);
    return date.toISOString();
  }
  subtractMonths(numOfMonths: number, date: Date = new Date()) {
    date.setMonth(date.getMonth() - numOfMonths);
    return date.toISOString();
  }
}
