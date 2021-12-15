const fs = require('fs');
const data = fs
  .readFileSync('data.txt', 'utf8')
  .split(/[\r\n]{2}/g)
  .map((l) => l.split('').map((n) => parseInt(n)));

function update(costs, cellCost, x, y, i, j) {
  if (x < 0 || y < 0 || x >= cellCost.length || y >= cellCost[0].length)
    return false;
  const cur = i * cellCost.length + j;
  const upd = x * cellCost.length + y;
  if (!costs[upd]) return false;
  if (!costs[cur]) {
    costs[cur] = costs[upd] + cellCost[i][j];
    return true;
  }

  if (costs[cur] > costs[upd] + cellCost[i][j]) {
    costs[cur] = costs[upd] + cellCost[i][j];
    return true;
  }

  return false;
}

function calculate(costs, cellCost) {
  let modified = false;
  for (let i = 0; i < cellCost.length; i++) {
    for (let j = 0; j < cellCost[0].length; j++) {
      const top = update(costs, cellCost, i - 1, j, i, j);
      const left = update(costs, cellCost, i, j - 1, i, j);
      const down = update(costs, cellCost, i + 1, j, i, j);
      const right = update(costs, cellCost, i, j + 1, i, j);
      modified |= top || left || down || right;
    }
  }

  return modified;
}

const costs = [...Array(data.length * data[0].length)].map((_) => 0);
costs[0] = data[0][0];

while (calculate(costs, data)) {}

console.log('Part 1', costs[costs.length - 1] - costs[0]);

const realData = [...Array(5).keys()].flatMap((j) =>
  data.map((l) =>
    [...Array(5).keys()].flatMap((i) =>
      l.map((n) => {
        const v = n + i + j;
        return v > 9 ? v - 9 : v;
      })
    )
  )
);

const realCosts = [...Array(realData.length * realData[0].length)].map(
  (_) => 0
);
realCosts[0] = realData[0][0];

while (calculate(realCosts, realData)) {}

console.log('Part 2', realCosts[realCosts.length - 1] - realCosts[0]);
