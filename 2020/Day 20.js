const fs = require('fs');

const data = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]{4}/);
const toHashNumber = (border) => {
  const bin = border.replace(/[\.#]/g, m => m === '#' ? 1 : 0);
  return Math.min(parseInt(bin, 2), parseInt(bin.split('').reverse().join(''), 2));
}

const tiles = data.map(tileData => {
  const lines = tileData.split(/[\r\n]+/);
  const m = lines[0].match(/Tile (\d+):/);
  const tile = parseInt(m[1]);
  const content = lines.slice(1).filter(l => /^[.#]+$/.test(l));
  const border = [
    content[0],
    content.map(l => l[l.length -1]).join(''),
    content[content.length - 1].split('').reverse().join(''),
    content.map(l => l[0]).reverse().join('')
  ];
  const borderHash = border.map(l => toHashNumber(l));
  const raw = content.slice(1, content.length - 1).map(l => l.substr(1, l.length - 2));
  return { tile, border, borderHash, raw };
}).map((t1, _, arr) => {
  const possibles = [0,1,2,3].map(i => arr.filter(t2 => t2.tile !== t1.tile && t2.borderHash.includes(t1.borderHash[i]))
    .map(t2 => t2.tile));
  return { ...t1, possibles };
});

const borderTiles = tiles.filter(t => t.possibles.filter(p => p.length === 0).length > 1).map(t => t.tile);
console.log('Part 1', borderTiles.reduce((acc, cur) => acc * cur, 1));

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

// function getPossibles(tiles, puzzle, i, max) {
// // Easier to understand but less performant due lack of cached values
//   const result = [...tiles.map(t => t.tile)];
//   if (i >= max) {
//     const top = tiles.find(t => t.tile === puzzle[i - max]).possibles.flat();
//     result.filter(t => top.includes(t));
//   }

//   if (i % max !== 0) {
//     const left = tiles.find(t => t.tile === puzzle[i-1]).possibles.flat();
//     result.filter(t => left.includes(t));
//   }

//   return result;
// }

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

function rotateContent(content) {
  const result = [];
  for (let i = 0; i < content.length; ++i) {
    result[i] = '';
    for (let j = 0; j < content[0].length; ++j) {
      result[i] += content[j][content[0].length - i - 1];
    }
  }

  return result;
}

function flipContent(content) {
  const result = [];
  for (let i = 0; i < content.length; ++i) {
    result[i] = content[content.length - i - 1];
  }

  return result;
}

function rotate(tile) {
  const { raw, content } = tile;
  const border = [...tile.border.slice(1), tile.border[0]];
  const borderHash = [...tile.borderHash.slice(1), tile.borderHash[0]];
  const newRaw = rotateContent(raw);
  tile.border = border;
  tile.borderHash = borderHash;
  tile.raw = newRaw;
}

function flip(tile) {
  const { raw, content } = tile;
  const border = [2,1,0,3].map(i => tile.border[i].split('').reverse().join(''));
  const borderHash = [2,1,0,3].map(i => tile.borderHash[i]);
  const newRaw = flipContent(raw);
  tile.border = border;
  tile.borderHash = borderHash;
  tile.raw = newRaw;
}

function validateRotation(puzzleTiles, i, max) {
  if (i % max !== 0 && puzzleTiles[i].border[3] !== puzzleTiles[i - 1].border[1].split('').reverse().join('')) {
    return false;
  }
  if (i >= max && puzzleTiles[i].border[0] !== puzzleTiles[i - max].border[2].split('').reverse().join('')) {
    return false;
  }

  return true;
}

function joinTiles(puzzleTiles, max) {
  return puzzleTiles.map(t => t.raw).reduce((acc,cur,idx) => {
    const off = cur.length * (idx - idx % max) / max;
    for (let j = 0; j < cur.length; ++j) {
      acc[off + j] = idx % max === 0 ? cur[j] : acc[off + j] + cur[j];
    }
    return acc;
  },[]);
}

function mountPuzzle(tiles, puzzle, max) {
  const puzzleTiles = puzzle.map(id => tiles.find(t => t.tile === id));
  let i0 = puzzleTiles[0].borderHash.findIndex(b => puzzleTiles[1].borderHash.includes(b));
  while(i0 !== 1) {
    rotate(puzzleTiles[0]);
    i0 = (i0 + 3) % 4;
  }

  
  for (let idx = 1; idx < puzzleTiles.length; ++idx) {
    let isValid = validateRotation(puzzleTiles, idx, max);
    for (let j = 0; j < 4 && !isValid; j++) {
      rotate(puzzleTiles[idx]);
      isValid = validateRotation(puzzleTiles, idx, max);
    }

    if (isValid) continue;
    flip(puzzleTiles[idx]);
    isValid = validateRotation(puzzleTiles, idx, max);
    for (let j = 0; j < 4 && !isValid; j++) {
      rotate(puzzleTiles[idx]);
      isValid = validateRotation(puzzleTiles, idx, max);
    }

    if (!isValid) {
      throw 'tile does not match';
    }
  }

  return joinTiles(puzzleTiles, max);
}

function findMonsters(mounted) {
  const m1Reg = /^.{18}#.$/;
  const m2Reg = /^#(.{4}##){3}#$/;
  const m3Reg = /^.(#..){6}.$/;

  let result = [];
  for (let i = 0; i < mounted.length - 2; ++i) {
    for (let j = 0; j < mounted[0].length - 20; ++j) {
      if (m1Reg.test(mounted[i].substr(j, 20)) &&
          m2Reg.test(mounted[i + 1].substr(j, 20)) &&
          m3Reg.test(mounted[i + 2].substr(j, 20))) {
        result.push({ i, j });
      }
    }
  }

  return result;
}

function paintMonsters(puzzle, monsters) {
  const markAt = (line, i) => line.substr(0, i) + 'O' + line.substr(i + 1);
  const result = [...puzzle];
  const m1 = [18];
  const m2 = [0,5,6,11,12,17,18,19];
  const m3 = [1,4,7,10,13,16];
  monsters.forEach(monster => {
    result[monster.i] = m1.reduce((acc, cur) => markAt(acc, cur + monster.j), result[monster.i]);
    result[monster.i+1] = m2.reduce((acc, cur) => markAt(acc, cur + monster.j), result[monster.i+1]);
    result[monster.i+2] = m3.reduce((acc, cur) => markAt(acc, cur + monster.j), result[monster.i+2]);
  });
  return result;
}

function findAllMonsters(mounted) {
  for (let i = 0; i < 4; i++) {
    const res = findMonsters(mounted);
    if (res.length) return paintMonsters(mounted, res);
    mounted = rotateContent(mounted);
  }
  
  mounted = flipContent(mounted);
  for (let i = 0; i < 4; i++) {
    const res = findMonsters(mounted);
    if (res.length) return paintMonsters(mounted, res);
    mounted = rotateContent(mounted);
  }

  return mounted;
}


/////// Part 2
const puzzle = calculate(tiles, [borderTiles[0]], 1, Math.sqrt(tiles.length));
if (!puzzle) {
  console.log('Cannot find puzzle');
  console.log(borderTiles);
  console.log(tiles.length);
  return;
}

const mountedPuzzle = mountPuzzle(tiles, puzzle, Math.sqrt(tiles.length));
const finalPuzzle = findAllMonsters(mountedPuzzle);
const roughness = finalPuzzle.reduce((acc, cur) => acc + (cur.match(/#/g)||[]).length, 0);
console.log('Part 2', roughness);