const fs = require('fs');
const fishes = fs
  .readFileSync('data.txt', 'utf8')
  .split(/,/g)
  .map((n) => parseInt(n));

const sum = (res) => res.reduce((acc, cur) => acc + cur, 0);

const initial = [...Array(9).keys()].map(
  (_, i) => fishes.filter((f) => f === i).length
);

function fishCycle(prev) {
  const res = prev.slice(1);
  res[6] += prev[0];
  return [...res, prev[0]];
}

const resP1 = [...Array(80).keys()].reduce(fishCycle, initial);

console.log('Part 1', sum(resP1));

const resP2 = [...Array(256).keys()].reduce(fishCycle, initial);

console.log('Part 2', sum(resP2));
