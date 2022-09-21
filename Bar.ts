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
  ): Promise<{ mean: number; targetPrices: Array<number> }> {
    // * Overshoot timeframe by * 2 to get a data set of the correct length.
    const closePricesInTimeframe =
      dataSet ?? (await this.daily(days * 2)).bars.map((item) => item.c);

    // * Trim overshoot to be the correct sized timeframe. 10 days, 50 days, etc..
    const targetPrices = closePricesInTimeframe.splice(
      closePricesInTimeframe.length - days
    );

    const mean = this.calcMeanOfPrices(targetPrices);
    return { mean, targetPrices };
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
    const simpleMovingAverage = this.roundNumber(meanOfSimplePrices, 100);

    // * Start the EMA calculation
    const multiplier = 2 / (days + 1);

    // * Put the SMA of the previous days into the first index of the EMA data set.
    exponentialAveragePriceRange.splice(0, 0, simpleMovingAverage);

    const ema = exponentialAveragePriceRange.reduce((prev, curr) => {
      const algo = curr * multiplier + prev * (1 - multiplier);

      return algo;
    });

    return this.roundNumber(ema, 100);
  }

  async bollingerBand() {
    // * Get 40 days of data, need first 20 for first data point.
    const targetPrices = (await this.movingAverage(40)).targetPrices;

    function calcPlotPoint(movingAverage: number, standardDeviation: number) {
      const k = standardDeviation * 2;
      const upperPlot = movingAverage + k;
      const bottomPlot = movingAverage - k;

      return {
        upperPlot,
        bottomPlot,
      };
    }
    const upperBand = [];
    const lowerBand = [];
    const gap = [];

    for (let i = 20; i < targetPrices.length; i++) {
      const prices = targetPrices.slice(i - 20, i);
      const mean = this.calcMeanOfPrices(prices);
      const standardDeviation = this.calcStandardDeviation(prices);

      const plots = calcPlotPoint(mean, standardDeviation);

      const upperPlot = this.roundNumber(plots.upperPlot, 100);
      const lowerPlot = this.roundNumber(plots.bottomPlot, 100);
      const gapBetweenPlots = upperPlot - lowerPlot;

      upperBand.push(upperPlot);
      lowerBand.push(lowerPlot);
      gap.push(this.roundNumber(gapBetweenPlots, 100));
    }

    return {
      upper_band: upperBand,
      lower_band: lowerBand,
      gap: gap,
    };
  }

  calcStandardDeviation(data: Array<number>) {
    const daysInData = data.length;
    // * calc SMA first
    const mean = this.calcMeanOfPrices(data);

    // * Subtract each day's close from the SMA to get the deviation
    // * Square each deviation
    const deviations = data.map((item) => {
      const diff = Math.abs(item - mean);
      const squared = diff ** 2;
      return this.roundNumber(squared, 1000);
    });

    // * Sum those squared deviations
    // * Divide the sum by the number of days.
    const sumOfDeviations = deviations.reduce((prev, curr) => prev + curr);
    const dividedSum = sumOfDeviations / daysInData;

    const standardDeviation = Math.sqrt(dividedSum);
    return standardDeviation;
  }

  subtractDays(numOfDays: number, date = new Date()) {
    date.setDate(date.getDate() - numOfDays);
    return date.toISOString();
  }

  subtractMonths(numOfMonths: number, date: Date = new Date()) {
    date.setMonth(date.getMonth() - numOfMonths);
    return date.toISOString();
  }

  calcMeanOfPrices(prices: Array<number>) {
    // * Calculate the mean of the price points
    const sumOfPrices = prices.reduce((prev, curr) => {
      return prev + curr;
    });
    const amountOfPrices = prices.length;
    const average = sumOfPrices / amountOfPrices;

    const mean = this.roundNumber(average, 100);

    return mean;
  }

  roundNumber(number: number, decimalPlaces: number) {
    return (
      Math.round((number + Number.EPSILON) * decimalPlaces) / decimalPlaces
    );
  }
}
