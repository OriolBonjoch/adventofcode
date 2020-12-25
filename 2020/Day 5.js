const fs = require('fs');

const lines = fs.readFileSync('data.txt', 'utf8').split(/[\n\r]+/g);
function toDec(x) {
  const binary = x.replace(/[BR]/g, (x) => '1').replace(/[FL]/g, x => '0');
  return parseInt(binary, 2);
}

let highest = 0;
const ids = [];
lines.forEach(line => {
  const row = toDec(line.substr(0, 7));
  const seat = toDec(line.substr(7, 3));
  const id = row * 8 + seat;
  ids.push(id);
  if (highest < id) {
    console.log(line, row, seat, id);
    highest = id;
  }
});

const posibles = [];
ids.sort().forEach((id, i) => {
  if (i+1 < ids.length && ids[i+1] === id + 2) {
    posibles.push(id+1);
  }
});

console.log(posibles);
console.log(highest);