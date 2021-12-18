const fs = require('fs');
const match = /^target area: x=(\-?\d+)..(\-?\d+), y=(\-?\d+)..(\-?\d+)$/.exec(
  fs.readFileSync('data.txt', 'utf8')
);
const data = {
  xMin: parseInt(match[1]),
  xMax: parseInt(match[2]),
  yMin: parseInt(match[3]),
  yMax: parseInt(match[4]),
};

const calc = (n) => (n * (n + 1)) / 2;

const resP1 = calc(data.yMin);
console.log('Part 1', resP1);

function process([px, py], [vx, vy]) {
  if (px > data.xMax || py < data.yMin) return false;
  const p = [px + vx, py + vy];
  if (
    p[0] >= data.xMin &&
    p[0] <= data.xMax &&
    p[1] >= data.yMin &&
    p[1] <= data.yMax
  )
    return true;
  return process(p, [vx > 0 ? vx - 1 : 0, vy - 1]);
}

const resP2 = [...Array(data.xMax).keys()]
  .map((n) => n + 1)
  .reduce(
    (acci, i) =>
      acci +
      [...Array(Math.abs(2 * data.yMin) + 1).keys()].reduce(
        (accj, j) => accj + (process([0, 0], [i, j + data.yMin]) ? 1 : 0),
        0
      ),
    0
  );

console.log('Part 2', resP2);
