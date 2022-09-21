import Bar from "./Bar.ts";
import Trade from "./Trade.ts";

// console.log(await new Bar("AAPL").weekly(2));
// console.log(await new Bar("AAPL").daily(50));
// console.log(await new Bar("AAPL").hour(2, 2));
// console.log(await new Bar("AAPL").minute(30, 2));
// console.log(await new Bar("AAPL").monthly(1, 10));
// console.log(await new Bar("AAPL").exponentialMovingAverage(10));
// console.log(await new Bar("AAPL").movingAverage(50));
// console.log(await new Bar("AAPL").bollingerBand(20));
console.log(await new Bar("AAPL").bollingerBandTrend());

//console.log(await new Trade("AAPL").latestTrade());
// console.log(await new Trade("AAPL").latestTrade());
