const fs = require('fs');
const data = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]+/g).map(l => l.split(''));

function countCell(current, coords) {
  if (!coords.length) {
    return current === '#' ? 1 : 0;
  }
  
  const i = coords[0]-1;
  return [i-1, i, i+1].reduce((acc, n) => {
    if (!current || !current[n]) return acc;
    return acc + countCell(current[n], coords.slice(1));
  }, 0);
}

const empty = (current) => typeof current === 'string' ? '.' : [...current.map(x => empty(x))];
function processMatrix(whole, current, coords = []) {
  if (typeof current === 'string') {
    const count = countCell(whole, coords);
    const nextActive = count === 3 || (current === '#' && count === 4);
    return nextActive ? '#' : '.';
  }

  const none = empty(current[0]);
  return [none, ...current, none].reduce(
    (acc, cur, i) => [...acc, processMatrix(whole, cur, [...coords, i])], []);
}


function calcTotal(current) {
  if (typeof current === 'string') return current === '#' ? 1 : 0;
  return current.reduce((acc, cur) => acc + calcTotal(cur), 0);
}

function repeat(matrix, n) {
  if (!n) return matrix;
  return repeat(processMatrix(matrix, matrix), n -1);
}

console.log('Part 1', calcTotal(repeat([data], 6)));
console.log('Part 2', calcTotal(repeat([[data]], 6)));