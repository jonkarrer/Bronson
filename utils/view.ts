import snapshot from "../utils/snapshot.ts";

type Averages = {
  5: number | undefined;
  9: number |undefined;
  20: number | undefined;
  50: number| undefined;
  200: number | undefined;
};

function roundNumber(number: number, decimalPlaces: number) {
  return (
    Math.round((number + Number.EPSILON) * decimalPlaces) / decimalPlaces
  );
}

/**
 * Compare each average to the 5 day average to get trend.
 * @param averages 
 * @returns 
 */
function trendSignal(averages: Averages) {
  const trendMap = { 9: "", 20: "", 50: "", 200: ""};

  function compareAverages(realtiveAverage: number, compareAverage: number) {
    if (realtiveAverage > compareAverage) {
      return "Bull";
    }
    if (realtiveAverage < compareAverage){
      return "Bear";
    }
    return "Even";
  }

  
  trendMap[9] = compareAverages(averages[5] ?? 0, averages[9] ?? 0);
  trendMap[20] = compareAverages(averages[5] ?? 0, averages[20] ?? 0);
  trendMap[50] = compareAverages(averages[5] ?? 0, averages[50] ?? 0);
  trendMap[200] = compareAverages(averages[5] ?? 0, averages[200] ?? 0);

  return trendMap;
}

function priceSignal(price:{vwap:number | undefined, latest:number | undefined}) {
  const vwap = price.vwap ?? 0;
  const latest = price.latest ?? 0;

  if (vwap > latest) {
    const value = "Under-Priced";
    const diff = roundNumber(vwap - latest, 100);
    return {value, diff, vwap, latest};
  }
  if (vwap < latest) {
    const value = "Over-Priced";
    const diff = roundNumber(latest - vwap, 100);
    return {value, diff, vwap, latest};
  }
  return "Even-Priced";
}

function strengthSignal() {
  
}

(async function view() {
  const watchlist = ["SMH", "XLV", "XLK", "XLU", "XLE", "XLP"];
  const summary = [];

  for (const stock of watchlist) {
    const snap = await snapshot(stock);

    const symbol = snap.symbol;
    const trend = trendSignal(snap.trend.SMA);
    const price = priceSignal(snap.price)
    const temp = {symbol:symbol,trend:trend, price:price};

    summary.push(temp);
  }
  console.log(summary);
})();