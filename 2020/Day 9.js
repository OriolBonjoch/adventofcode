const fs = require('fs');

const data = fs.readFileSync('data.txt').toString().split(/\n/).map(x => parseInt(x));
const gap = 25;
let total = 0;
data.filter((_, i) => i >= gap).forEach((n, i) => {
  const gapNums = data.filter((_, j) => j >= i && j < i + gap);
  const isValid = gapNums.some((a, j) => gapNums.filter((_, k) => j < k).some(b => a + b === n));
  if (!isValid) total = n;
});

console.log("Part 1", total);
data.forEach((n, i) => {
  let sum = n, j = 1;
  while (j < data.length && sum < total) {
    sum += data[i + j++];
  }
  
  if (sum === total && j > 1) {
    const gapNums = data.filter((_, k) => k >= i && k < i + j);
    console.log("Part 2", Math.min(...gapNums) + Math.max(...gapNums));
  }
});