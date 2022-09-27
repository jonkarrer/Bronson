import "https://deno.land/std@0.156.0/dotenv/load.ts";

export default class Trade {
  baseUrl: string;
  options: {
    method: string;
    headers: {
      [index: string]: string | undefined;
    };
  };
  constructor(symbol: string) {
    this.baseUrl = `https://data.alpaca.markets/v2/stocks/${symbol}/trades`;
    this.options = {
      method: "GET",
      headers: {
        "APCA-API-KEY-ID": Deno.env.get("ALPACA_API_KEY_ID"),
        "APCA-API-SECRET-KEY": Deno.env.get("ALPACA_SECRET_KEY"),
      },
    };
  }

  async request(query: string, options = this.options) {
    const url = this.baseUrl + `${query}`;
    try {
      const request = await fetch(url, options as any);
      const response = await request.json();
      return response;
    } catch (error) {
      console.log("error", error);
    }
  }

  async trades(startDate: string, endDate: string) {
    const data = await this.request(
      `?start=${this.setDate(startDate)}&end=${this.setDate(endDate)}&limit=30`
    );

    return data;
  }

  async latestTrade() {
    const data = await this.request(`/latest`);
    return data;
  }

  setDate(startDate: string) {
    return new Date(startDate).toISOString();
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
