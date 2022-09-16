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

  subtractDays(numOfDays: number, date = new Date()) {
    date.setDate(date.getDate() - numOfDays);
    return date.toISOString();
  }
  subtractMonths(numOfMonths: number, date: Date = new Date()) {
    date.setMonth(date.getMonth() - numOfMonths);
    return date.toISOString();
  }

  async movingDayAverage(days: number): Promise<number> {
    const close = (await this.daily(days)).bars.map((item) => item.c);
    const average = close.reduce((prev, curr) => {
      return prev + curr;
    });
    return average / close.length;
  }
}
