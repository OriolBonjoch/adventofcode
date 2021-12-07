const fs = require('fs');
const data = fs
  .readFileSync('data.txt', 'utf8')
  .split(/,/g)
  .map((n) => parseInt(n))
  .sort();

function calculator(cost) {
  const from = data[0];
  const to = data[data.length - 1];
  let minSum = data.reduce((acc, cur) => acc + cost(Math.abs(cur - from)), 0);
  for (let i = from + 1; i < to; i++) {
    const sum = data.reduce((acc, cur) => acc + cost(Math.abs(cur - i)), 0);
    if (minSum > sum) minSum = sum;
  }

  return minSum;
}

const resP1 = calculator((n) => n);
console.log('Part 1', resP1);

const resP2 = calculator((n) => (n * (n + 1)) / 2);
console.log('Part 2', resP2);
