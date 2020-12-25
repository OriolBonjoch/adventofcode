const fs = require('fs');

const data = fs.readFileSync('data.txt').toString().split(/[\n\r]+/);
const wall = `.${data[0].replace(/\w/g, '.')}.`;
const borderData = [wall, ...data.map(x => `.${x}.`), wall];

const seatSwitch = (limit) => ({
  '.': x => '.',
  'L': x => x === 0 ? '#' : 'L',
  '#': x => x > limit ? 'L': '#'
});

function calcDirectionDeep(seats, i, j, ii, jj) {
  if (ii === 0 && jj === 0) {
    return seats[i][j] === '#';
  }

  let x = i+ii, y = j+jj;
  while (x > 0 && x < seats.length && y > 0 && y < seats[x].length) {
    if (seats[x][y] !== '.') {
      return seats[x][y] === '#';
    }

    x += ii;
    y += jj;
  }
  
  return false;
}

function calc(seats, i,j) {
  const n = [-1,0,1].reduce((acc, i_off) => acc + [-1,0,1].filter(j_off => seats[i+i_off][j+j_off] === '#').length, 0);
  return seatSwitch(4)[seats[i][j]](n);
}

function calcDeep(seats, i, j) {
  const n = [-1,0,1].reduce((acc, i_off) => acc + [-1,0,1].filter(j_off => calcDirectionDeep(seats, i, j, i_off, j_off)).length, 0);
  return seatSwitch(5)[seats[i][j]](n);
}

function calculateSeats(seats, func) {
  let prev = [];
  while (prev.join('') !== seats.join('')) {
    prev = [...seats];
    for(let i = 1; i < seats.length - 1; i++) {
      for(let j = 1; j < seats[i].length - 1; j++) {
        seats[i] = seats[i].substring(0, j) + func(prev, i, j) + seats[i].substring(j + 1);
      }
    }
  }

  return (seats.join('').match(/#/g) || []).length;
}

console.log("Part 1", calculateSeats([...borderData], calc));
console.log("Part 2", calculateSeats([...borderData], calcDeep));