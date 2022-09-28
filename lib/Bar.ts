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
  symbol: string;
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
  dailyCloses: Array<number> | undefined;
  dailyBars: Array<Bars> | undefined;
  constructor(symbol: string) {
    this.baseUrl = `https://data.alpaca.markets/v2/stocks/${symbol}/bars`;
    this.options = {
      method: "GET",
      headers: {
        "APCA-API-KEY-ID": Deno.env.get("ALPACA_API_KEY_ID"),
        "APCA-API-SECRET-KEY": Deno.env.get("ALPACA_SECRET_KEY"),
      },
    };
    this.dailyCloses;
    this.dailyBars;
  }

  async init(data: Array<number> | undefined = undefined) {
    try {
      this.dailyBars = (await this.daily(300)).bars;
      this.dailyCloses = data ?? this.dailyBars.map((item) => item.c);

      if (!this.dailyCloses) {
        throw new Error("Data not found");
      }
    } catch (err) {
      console.log("Error in initialization", err);
    }
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

  movingAverage(
    days: number
  ): { mean: number; targetPrices: Array<number> } | undefined {
    if (!this.dailyCloses) {
      return undefined;
    }

    const closePricesInTimeframe = [...this.dailyCloses];

    // * Trim data to be the correct sized timeframe. 10 days, 50 days, etc..
    const targetPrices = closePricesInTimeframe.splice(
      closePricesInTimeframe.length - days
    );

    const mean = this.roundNumber(this.calcMeanOfPrices(targetPrices), 1000);

    return { mean, targetPrices };
  }

  exponentialMovingAverage(
    days: number,
    data: Array<number> | undefined = undefined
  ) {
    if (!this.dailyCloses) {
      return undefined;
    }

    // * Overshoot timeframe by * 2 to get a data set of the correct length.
    const closePricesInTimeframe = data ?? [...this.dailyCloses];

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

  get price() {
    const allVwaps = this.dailyBars?.map((item) => item.vw);
    const currentVwap = allVwaps?.at(-1);

    if (!currentVwap) {
      return undefined;
    }
    return {
      vwap: this.roundNumber(currentVwap, 1000),
      latest: this.dailyCloses?.at(-1),
    };
  }

  bollingerBand(period: number) {
    // * Get 40 days of data, need first 20 for first data point.
    const targetPrices = this.movingAverage(period * 2)?.targetPrices;

    function calcPlotPoint(movingAverage: number, standardDeviation: number) {
      const k = standardDeviation * 2;

      const upperPlot = movingAverage + k;
      const bottomPlot = movingAverage - k;

      return {
        upperPlot,
        bottomPlot,
      };
    }

    const bandWidth = [];
    let upperBB = 0;
    let lowerBB = 0;
    let middleBB = 0;

    if (!targetPrices) {
      return undefined;
    }

    for (let i = period; i < targetPrices.length; i++) {
      // * Progressivly "climb up" the arrray one value at a time
      const prices = targetPrices.slice(i - period, i);
      const mean = this.calcMeanOfPrices(prices);
      const standardDeviation = this.calcStandardDeviation(prices);

      // * Get the plot point of this current target slice
      const plots = calcPlotPoint(mean, standardDeviation);

      const upperPlot = this.roundNumber(plots.upperPlot, 100);
      const lowerPlot = this.roundNumber(plots.bottomPlot, 100);
      const gapBetweenPlots = upperPlot - lowerPlot;

      // * Band width is an indicator
      const width = gapBetweenPlots / mean;

      // * When the last number is hit. Used to calculate BBtrend.
      if (targetPrices.length - i === 1) {
        upperBB = upperPlot;
        lowerBB = lowerPlot;
        middleBB = mean;
      }

      bandWidth.push(this.roundNumber(width, 100));
    }

    return {
      bandWidth,
      upperBB,
      lowerBB,
      middleBB,
    };
  }

  bollingerBandTrend() {
    const twentyPeriodBand = this.bollingerBand(20);
    const fiftyPeriodBand = this.bollingerBand(50);

    if (!twentyPeriodBand || !fiftyPeriodBand) {
      return undefined;
    }

    const lower = Math.abs(twentyPeriodBand.lowerBB - fiftyPeriodBand.lowerBB);
    const upper = Math.abs(twentyPeriodBand.upperBB - fiftyPeriodBand.upperBB);
    const diff = lower - upper;

    const trend = diff / twentyPeriodBand.middleBB;

    return this.roundNumber(trend, 100);
  }

  stochastic(period: number) {
    const targetPrices = this.movingAverage(period * 2)?.targetPrices;

    if (!targetPrices) {
      return undefined;
    }

    let kLine: Array<number> = [];
    let dLine: Array<number> = [];
    let dSlowLine: Array<number> = [];

    (function calcK() {
      for (let i = period; i <= targetPrices.length; i++) {
        // * Progressivly "climb up" the arrray one value at a time
        const prices = targetPrices.slice(i - period, i);

        // * Last close price
        const recentPrice = prices.at(-1) ?? 0;
        const lowestPrice = prices.reduce((prev, curr) => {
          if (prev > curr) {
            return curr;
          } else {
            return prev;
          }
        });
        const highestPrice = prices.reduce((prev, curr) => {
          if (prev < curr) {
            return curr;
          } else {
            return prev;
          }
        });

        const x = recentPrice - lowestPrice;
        const b = 100 * x;
        const a = highestPrice - lowestPrice;

        const k = b / a;

        kLine.push(Math.round((k + Number.EPSILON) * 100) / 100);
      }
    })();

    (function calcD() {
      for (let i = 3; i <= kLine.length; i++) {
        // * Progressivly "climb up" the arrray one value at a time
        const prices = kLine.slice(i - 3, i);

        const sumOfPrices = prices.reduce((prev, curr) => {
          return prev + curr;
        });

        const mean = sumOfPrices / 3;

        dLine.push(Math.round((mean + Number.EPSILON) * 100) / 100);
      }
    })();

    (function calcDSlowLine() {
      for (let i = 3; i <= dLine.length; i++) {
        // * Progressivly "climb up" the arrray one value at a time
        const prices = dLine.slice(i - 3, i);

        const sumOfPrices = prices.reduce((prev, curr) => {
          return prev + curr;
        });

        const mean = sumOfPrices / 3;

        dSlowLine.push(Math.round((mean + Number.EPSILON) * 100) / 100);
      }
    })();

    return { kLine, dLine, dSlowLine };
  }

  MACD() {
    // EMA(12) - EMA(26)
    if (!this.dailyCloses) {
      return undefined;
    }

    const macdLine = [];

    for (let i = 0; i < 9; i++) {
      const targetSize = this.dailyCloses.length - i;

      const targetPrices = this.dailyCloses.slice(targetSize - 27, targetSize);
      const shortPeriod = this.exponentialMovingAverage(12, targetPrices);
      const longPeriod = this.exponentialMovingAverage(26, targetPrices);

      if (!shortPeriod || !longPeriod) {
        return undefined;
      }

      const diff = shortPeriod - longPeriod;

      macdLine.unshift(this.roundNumber(diff, 100));
    }

    const signal_line = this.exponentialMovingAverage(9, macdLine);
    return {
      macdLine,
      signal_line,
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

      return this.roundNumber(squared, 10000);
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

    const mean = average;

    return mean;
  }

  roundNumber(number: number, decimalPlaces: number) {
    return (
      Math.round((number + Number.EPSILON) * decimalPlaces) / decimalPlaces
    );
  }
}
