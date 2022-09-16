# Trading With Alpaca

https://alpaca.markets/docs/api-references/market-data-api/stock-pricing-data/historical/#bar

## Technical analysis

1. Overlays
   - Technical indicators that use the same scale as prices are plotted over the top of the prices on a stock chart. Examples include moving averages and Bollinger Bands® or Fibonacci lines.
2. Oscillators
   - Rather than being overlaid on a price chart, technical indicators that oscillate between a local minimum and maximum are plotted above or below a price chart. Examples include the stochastic oscillator, MACD, or RSI. It will mainly be these second kind of technical indicators that we consider in this article.

## Algorithmic Trading Statagies

1. Trend-Following Statagies

   - The most common algorithmic trading strategies follow trends in moving averages, channel breakouts, price level movements, and related technical indicators. These are the easiest and simplest strategies to implement through algorithmic trading because these strategies do not involve making any predictions or price forecasts. Trades are initiated based on the occurrence of desirable trends, which are easy and straightforward to implement through algorithms without getting into the complexity of predictive analysis. Using 50- and 200-day moving averages is a popular trend-following strategy.

2. Arbitrage Opportunities

   - Buying a dual-listed stock at a lower price in one market and simultaneously selling it at a higher price in another market offers the price differential as risk-free profit or arbitrage.

3. Index Fund Rebalancing

   - Index funds have defined periods of rebalancing to bring their holdings to par with their respective benchmark indices. This creates profitable opportunities for algorithmic traders, who capitalize on expected trades that offer 20 to 80 basis points profits depending on the number of stocks in the index fund just before index fund rebalancing. Such trades are initiated via algorithmic trading systems for timely execution and the best prices.

4. Mathmatical Model Based Stategies

   - Proven mathematical models, like the delta-neutral trading strategy, allow trading on a combination of options and the underlying security. (Delta neutral is a portfolio strategy consisting of multiple positions with offsetting positive and negative deltas—a ratio comparing the change in the price of an asset, usually a marketable security, to the corresponding change in the price of its derivative—so that the overall delta of the assets in question totals zero.)

5. Trading Range (Mean Reversion)

   - Mean reversion strategy is based on the concept that the high and low prices of an asset are a temporary phenomenon that revert to their mean value (average value) periodically. Identifying and defining a price range and implementing an algorithm based on it allows trades to be placed automatically when the price of an asset breaks in and out of its defined range.

6. Implementation Shortfall

   - The implementation shortfall strategy aims at minimizing the execution cost of an order by trading off the real-time market, thereby saving on the cost of the order and benefiting from the opportunity cost of delayed execution. The strategy will increase the targeted participation rate when the stock price moves favorably and decrease it when the stock price moves adversely.

## Tony Corbell Framework

[Book](https://books.mec.biz/tmp/books/KSPF578WWBQYG4VRFYV6.pdf)
