# Trading With Alpaca

https://alpaca.markets/docs/api-references/market-data-api/stock-pricing-data/historical/#bar

## Technical analysis

1. Overlays
   - Technical indicators that use the same scale as prices are plotted over the top of the prices on a stock chart. Examples include moving averages and Bollinger Bands® or Fibonacci lines.
2. Oscillators
   - Rather than being overlaid on a price chart, technical indicators that oscillate between a local minimum and maximum are plotted above or below a price chart. Examples include the stochastic oscillator, MACD, or RSI. It will mainly be these second kind of technical indicators that we consider in this article.
3. Five catagories of "Information". These are groups of indicators that have been catagorized by type.
   - Trend indicators (lagging) analyze whether a market is moving up, down, or sideways over time.
   - Mean reversion indicators (lagging) measure how far a price swing will stretch before a counter impulse triggers a retracement.
   - Relative strength indicators (leading) measure oscillations in buying and selling pressure.
   - Volume indicators (leading or lagging) tally up trades and quantify whether bulls or bear are in control.
   - Momentum indicators (leading) evaluate the speed of price change over time.
4. Popular indicators
   - Simple Moving Averages (SMAs) <b>Trend</b>
   - Exponential Moving Averages (EMAs) <b>Trend</b>
   - Bollinger Bands <b>Mean Reversion</b>
   - Stochastics, RSI <b>Relative Strength</b>
   - On-Balance Volume (OBV) <b>Volume</b>
   - MACD <b>Momentum</b>

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

## Toby Crabell Framework

[Book](https://books.mec.biz/tmp/books/KSPF578WWBQYG4VRFYV6.pdf)

### Introduction

> I have found it much more fruitful to use direction of the open as the last piece of information in a pattern, rather than closing prices.
> Action that varies from the ideal is suspect.

1. Open Range Breakout

- Defined as a trade taken at a predetermined amount off the open.
- Uses a mathmatical technique called the "Stretch" to determine the point of entry.
- In more experienced tests of ORB, a constant replaces the stretch.

2. Short Term Price Patterns

- An analysis of recent price action in terms of previous closes, openings, range size and moves off the open.
- Attempt to quantify the market action so as to test for significant directional movement.
- The price patterns allow us to take large amounts of information about the market and condense it into a workable unit. Market action can thus be tested.
- The tendencies found within the testing can then be used as a partial basis for taking action in the market.

3. Contraction/Expansion

- The Contraction/Expansion Principle states that the market is constantly changing from a period of movement to a period of rest and back to a period of movement.
- This interchange between the phases of motion and rest is contatly taking place, one the reson for the other to exist.
- Strongly suggests that this priciple applies to the particular case of price action off the open.

4. Integration of ORB, Price Patterns, and Contraction/Expansion

- These three concepts provide the basic framework for viewing the market. The combination of these three can capture the essential action of the marketplace.
- The "dialy bias" can be derived from these three different types of price action.
- The "dialy bias" is the most important aspect of this research.

### Opening Range Breakout (ORB)

1. Brief summary

- An OBR is a trade taken at a predeterminded amount above or below the opening range.
- When the predetermined amount (the Stretch) is computed, a buy stop is placed that amount abouve the high of the opening range, and a sell stop is placed the same amount below the low of the opening range. The first stop is the position and the other stop is used as a protective stop.

2. The Stretch

- Determined by looking at the previous ten days and averaging the sum of the differences between the open for each day and the closest extreme to the open on each day.

3. Opening Range Breakout Preference

- There are days when a trade in only one direction is taken, this is called the (ORBP).
- Similiar to the ORB, but the only order entered is the stop in the direction of entry. The protective stop is only entered after the initial stop.
- One example is if the market trades to the stretch in the opposite direction first; the ORBP is nullified and the resting order canceled.
- The ORBP provides an effective trade entry at times of a clear bias in one direction. A running market when defined provides a very clear bias. <b>On any inside day the ORBP should be taken.</b>

4. ORB Effectiveness

- ORB is effective after inside days that have a smaller daily range than the previous four or five days.
- Or after any day that has a daily range less than the previous six days (NR7) whether an inside day or not.
- Hook days are any day that opens above or below the previous day's high or low then proceeds to the reverse the previous day's close but does so with a narrowing daily range relative to the previous day.
- Inside days act as springboards for an immediate continuation in the direction of the run.
- Gaps in the direction of the run is a strong indecation of continuation and an ORBP can be taken in the direction of the gap with an overnight position held if a big day follows.
- Upthrust/Springs, Reversal Gaps, or any sharp reversal should be followed up with an ORBP in the direction of the reversal for a couple days, if it confirms the intermediate trend.
- Trailing stops are recommended

5. Timing

- In general, the earlier in the session the entry is taken the better. <b>The ideal entry is within the first 10 minutes</b>
- The more time that passes between the open and trade entry the lower the probability is of success. <b>Adjust the size of your position downward as the day goes on</b>.
- The objective of these entry techniques is to establish a position for a two to three day run, but this can be considered only if a substantial profit is realized by the end of the session.
- The ideal trade would show a profit instantly.
- In general, stops should be moved to the break even within one hour of entry.
- The ORB can be utilized as a general indicator of the bias every day. <b>Whichever side of the Stretch is traded first will indicate the bias in that direction for the next 2-3 hours of the session

6. Summary

- The open is a market primary.
- On certain days, it acts as an ideal point of entry upon breakout.
- On any day that such a breakout occurs within the first ten minutes of trade, the info is overwhelmingly in favor of a continuation of that move.
