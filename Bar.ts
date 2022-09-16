import "https://deno.land/std@0.156.0/dotenv/load.ts";

export default class Bar {
  baseUrl: string;
  options: {
    method: string;
    headers: {
      [index: string]: string | undefined;
    };
  };
  constructor(private symbol: string) {
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

  async data(timeframe: string, days: number) {
    const day = new Date();
    day.setDate(day.getDate() - days);

    const data = await this.request(
      `timeframe=${timeframe}&start=${day.toISOString()}`
    );

    return data;
  }
  // get movingDayAverage() {
  //   const response = await this.bars();
  //   const close = response.bars.map((item) => item.c);
  //   const average = close.reduce((prev, curr) => {
  //     return prev + curr;
  //   });
  //   console.log(average / close.length);
  // }
}
