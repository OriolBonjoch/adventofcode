const fs = require('fs');
const data = fs
  .readFileSync('data.txt', 'utf8')
  .split(/[\r\n]{2}/g)
  .map((l) => l.split('').map((n) => parseInt(n)));

function basin(x, y, visited) {
  if (x < 0 || y < 0 || x >= data.length || y >= data[0].length) return 0;
  const point = `${x},${y}`;
  if (visited.indexOf(point) !== -1 || data[x][y] === 9) return 0;

  visited.push(point);
  return 1
    + basin(x - 1, y, visited)
    + basin(x + 1, y, visited)
    + basin(x, y - 1, visited)
    + basin(x, y + 1, visited);
}

const height = data.length;
const width = data[0].length;
let resP1 = 0;
let resP2 = [];
for (let i = 0; i < width; i++) {
  for (let j = 0; j < height; j++) {
    if (j > 0 && data[j - 1][i] <= data[j][i]) continue;
    if (i > 0 && data[j][i - 1] <= data[j][i]) continue;
    if (j < height - 1 && data[j + 1][i] <= data[j][i]) continue;
    if (i < width - 1 && data[j][i + 1] <= data[j][i]) continue;

    resP2.push(basin(j, i, []));
    resP1 += data[j][i] + 1;
  }
}

console.log('Part 1', resP1);

const res = resP2.sort((a, b) => b - a).slice(0, 3).reduce((acc, cur) => acc * cur, 1);
console.log('Part 2', res);
