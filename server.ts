import Bar from "./Bar.ts";

// console.log(await new Bar("SD").weekly(2));
// console.log(await new Bar("SD").daily(50));
// console.log(await new Bar("SD").hour(2, 2));
// console.log(await new Bar("SD").minute(30, 2));
// console.log(await new Bar("SD").monthly(1, 10));
console.log(await new Bar("SQQQ").movingDayAverage(50));
