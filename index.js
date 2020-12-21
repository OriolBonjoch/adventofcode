const fs = require('fs');

const data = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]{4}/);
const toNumbers = (border) => {
  const bin = border.replace(/[\.#]/g, m => m === '#' ? 1 : 0);
  return [parseInt(bin, 2), parseInt(bin.split('').reverse().join(''), 2)];
}
const tiles = data.map(tileData => {
  const lines = tileData.split(/[\r\n]+/);
  const m = lines[0].match(/Tile (\d+):/);
  const tile = parseInt(m[1]);
  const content = lines.slice(1);
  const border = [
    content[0],
    content.map(l => l[l.length -1]).join(''),
    content[content.length - 1],
    content.map(l => l[0]).join('')
  ].map(l => Math.min(...toNumbers(l)));
  const raw = content.slice(1, content.length-1).map(l => l.substr(1, l.length - 2));
  return { tile, border, raw, content };
}).map((t1, _, arr) => {
  const possibles = [0,1,2,3].map(i => arr.filter(t2 => t2.tile !== t1.tile && t2.border.includes(t1.border[i]))
    .map(t2 => t2.tile)).map(t => t);
  return { ...t1, possibles };
});

console.log('Part 1', tiles.filter(t => t.possibles.filter(p => p.length === 0).length > 1).map(t => t.tile).reduce((acc, cur) => acc * cur, 1));

function validate(tile, puzzle, i, max) {
  if (i % max !== 0 && !tile.possibles.flat().includes(puzzle[i-1])) return false;
  if (i >= max && !tile.possibles.flat().includes(puzzle[i-max])) return false;
  return true;
}

function getPossibles(tiles, puzzle, i, max) {
  if (i === 0) return tiles.map(t => t.tile);
  if (i % max === 0) return tiles.find(t => t.tile === puzzle[i - max]).possibles.flat();
  return tiles.find(t => t.tile === puzzle[i-1]).possibles.flat();
}

function calculate(tiles, puzzle, i, max) {
  if (puzzle.length === tiles.length) return [...puzzle];
  const tileIds = getPossibles(tiles, puzzle, i, max).filter(id => !puzzle.includes(id));
  for(let tileId of tileIds) {
    const tile = tiles.find(t => t.tile === tileId);
    if (!validate(tile, puzzle, i, max)) {
      continue;
    }

    const result = calculate(tiles, [...puzzle, tileId], i + 1, max);
    if (result) return result;
  }

  return null;
}

function rotate(tile) {
  const { raw } = tile;
  const border = [...tile.border.slice(1), tile.border[0]];
  const newRaw = [];
  for (let i = 0; i < raw.length; ++i) {
    newRaw[i] = '';
    for (let j = 0; j < raw[0].length; ++j) {
      newRaw[i] += raw[j][raw[0].length - i - 1];
    }
  }

  tile.border = border;
  tile.raw = newRaw;
}

function validateRotation(puzzleTiles, i, max) {
  if (i % max !== 0 && puzzleTiles[i].border[3] === puzzleTiles[i - 1].border[1]) return true;
  if (i >= max && puzzleTiles[i].border[0] === puzzleTiles[i - max].border[2]) return true;
  return false;
}

function mountPuzzle(tiles, puzzle, max) {
  const puzzleTiles = puzzle.map(id => tiles.find(t => t.tile === id));
  for (let idx = 1; idx < puzzleTiles.length; ++idx) {
    for (let j = 0; j < 4 && validateRotation(puzzleTiles, idx, max); j++) {
      rotate(puzzleTiles[idx]);
    }
  }

  return puzzleTiles.map(t => t.raw).reduce((acc,cur,idx,arr) => {
    const off = max * idx - idx % max;
    for (let j = 0; j < cur.content.length; ++j) {
      acc[off + j] = idx % max === 0 ? cur.content[j] : acc[off + j] + cur.content[j];
    }
  },[]);
}

const puzzle = calculate(tiles, [1283], 1, Math.sqrt(tiles.length));
const mounted = mountPuzzle(tiles, puzzle, Math.sqrt(tiles.length));

console.log(mounted);