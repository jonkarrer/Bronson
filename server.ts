import Bar from "./Bar.ts";
import Trade from "./Trade.ts";

const testBar = new Bar("CCJ");
await testBar.init();
// console.log(await new Bar("AAPL").weekly(2));
// console.log(await new Bar("AAPL").daily(50));
// console.log(await new Bar("AAPL").hour(2, 2));
// console.log(await new Bar("AAPL").minute(30, 2));
// console.log(await new Bar("AAPL").monthly(1, 10));

// console.log(testBar.exponentialMovingAverage(10));
// console.log(testBar.movingAverage(50));

// console.log(testBar.bollingerBand(20));
// console.log(testBar.bollingerBandTrend());

console.log(testBar.stochastic(14)?.kLine);
console.log(testBar.stochastic(14)?.dLine);
console.log(testBar.stochastic(14)?.dSlowLine);

//console.log(await new Trade("AAPL").latestTrade());
// console.log(await new Trade("AAPL").latestTrade());
