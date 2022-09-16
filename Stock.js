import "https://deno.land/std@0.156.0/dotenv/load.ts";

export default class Stock {
  constructor(symbol) {
    this.baseUrl = `https://data.alpaca.markets/v2/stocks/${symbol}/bars`;
    this.options = {
      method: "GET",
      headers: {
        "APCA-API-KEY-ID": Deno.env.get("ALPACA_API_KEY_ID"),
        "APCA-API-SECRET-KEY": Deno.env.get("ALPACA_SECRET_KEY"),
      },
    };
  }

  async bars() {
    const day = new Date();
    day.setDate(day.getDate() - 50);

    const url = this.baseUrl + `?timeframe=1Day&start=${day.toISOString()}`;
    const request = await fetch(url, this.options);

    const response = await request.json();

    return response;
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
