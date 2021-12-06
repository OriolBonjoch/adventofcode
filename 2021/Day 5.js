const fs = require('fs');
const size = 1000;
const lines = fs
  .readFileSync('data.txt', 'utf8')
  .split(/[\r\n]{2}/g)
  .map((l) => /^(\d+),(\d+) -> (\d+),(\d+)$/.exec(l))
  .map((m) => (m ? m.slice(1, 5).map((i) => parseInt(i)) : null));

function fillVerticalLine(res, line) {
  if (line[0] !== line[2]) return res;

  const from = line[1] > line[3] ? line[3] : line[1];
  const to = line[1] > line[3] ? line[1] : line[3];

  for (let i = from; i <= to; ++i) {
    res[line[0]][i] = res[line[0]][i] > 1 ? 2 : res[line[0]][i] + 1;
  }

  return res;
}

function fillHorizontalLine(res, line) {
  if (line[1] !== line[3]) return res;

  const from = line[0] > line[2] ? line[2] : line[0];
  const to = line[0] > line[2] ? line[0] : line[2];
  for (let i = from; i <= to; ++i) {
    res[i][line[1]] = res[i][line[1]] > 1 ? 2 : res[i][line[1]] + 1;
  }

  return res;
}

function fillDiagonalLine(res, line) {
  if (line[1] === line[3] || line[0] === line[2]) return res;

  const to = Math.abs(line[0] - line[2]);
  const iInc = (line[2] - line[0]) / to;
  const jInc = (line[3] - line[1]) / to;

  let j = 0;
  for (let i = 0; i <= to; i++) {
    const x = line[0] + i * iInc;
    const y = line[1] + j;
    res[x][y] = res[x][y] > 1 ? 2 : res[x][y] + 1;
    j += jInc;
  }

  return res;
}

const res1 = [fillVerticalLine, fillHorizontalLine].reduce(
  (acc, cur) => lines.reduce(cur, acc),
  [...Array(size).keys()].map((_) => [...Array(size).keys()].map((_) => 0))
);

const countP1 = res1.reduce(
  (a0, c0) => a0 + c0.reduce((a1, c1) => (c1 === 2 ? a1 + 1 : a1), 0),
  0
);

console.log('Part 1', countP1);

const res2 = [fillDiagonalLine].reduce(
  (acc, cur) => lines.reduce(cur, acc),
  res1
);

const countP2 = res2.reduce(
  (a0, c0) => a0 + c0.reduce((a1, c1) => (c1 === 2 ? a1 + 1 : a1), 0),
  0
);

console.log('Part 2', countP2);
