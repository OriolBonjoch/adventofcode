const fs = require('fs');

const data = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]+/).filter(l => /^[nsew]+$/.test(l)).map(l => l.match(/[ns]?[ew]/g));

const move = {
  '-': (p) => ({...p}),
  'e': (p) => ({ x: p.x + 1, y: p.y}),
  'w': (p) => ({ x: p.x - 1, y: p.y}),
  'se': (p) => ({ x: p.x + (p.y % 2 ? 1 : 0), y: p.y - 1}),
  'sw': (p) => ({ x: p.x - (p.y % 2 ? 0 : 1), y: p.y - 1}),
  'ne': (p) => ({ x: p.x + (p.y % 2 ? 1 : 0), y: p.y + 1}),
  'nw': (p) => ({ x: p.x - (p.y % 2 ? 0 : 1), y: p.y + 1}),
}

const calculateTile = (tile) => tile.reduce((acc, cur) => move[cur](acc), { x: 0, y: 0});
const equal = (t1, t2) => t1.x === t2.x && t1.y === t2.y;

function paintTiles(positions) {
  return positions.reduce((acc, cur) => acc.find(t => equal(t, cur)) ? acc.filter(t => !equal(t, cur)) : [...acc, cur], []);
}

function removeDuplicates(positions) {
  return positions.reduce((acc, cur) => acc.find(t => equal(t, cur)) ? acc : [...acc, cur], []);
}

function repaint(blackTiles) {
  const adjacentTiles = removeDuplicates(blackTiles.flatMap(t => ['nw','w','sw','ne','e','se','-'].map(m => move[m](t))));
  return adjacentTiles.filter(t1 => {
    const isBlack = blackTiles.some(t2 => equal(t1,t2));
    const count = ['nw','w','sw','ne','e','se'].map(m => move[m](t1)).filter(adj => blackTiles.some(b => equal(b, adj))).length;
    return isBlack ? count === 1 || count === 2 : count === 2;
  });
}

function calculateDays(blackTiles, days) {
  while(days--) {
    blackTiles = repaint(blackTiles);
  }

  return blackTiles;
}

const positions = data.map(l => calculateTile(l));
const blackTiles = paintTiles(positions);
console.log('Part 1', blackTiles.length);
console.log('Part 2', calculateDays(blackTiles, 100).length);