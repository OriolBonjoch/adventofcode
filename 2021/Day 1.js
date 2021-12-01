const fs = require('fs');
const lines = fs.readFileSync('data.txt', 'utf8')
  .split(/[\r\n]{2}/g)
  .map(x => parseInt(x))

const sum1 = lines.slice(1).reduce((acc, cur, i) => lines[i] < cur ? acc + 1 : acc, 0);
const windowLines = lines.slice(2).map((cur, i) => lines[i] + lines[i+1] + cur);
const sum2 = windowLines.slice(1).reduce((acc, cur, i) => windowLines[i] < cur ? acc + 1 : acc, 0);

console.log('Part 1', sum1);
console.log('Part 2', sum2);