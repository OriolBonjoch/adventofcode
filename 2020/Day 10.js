const fs = require('fs');

const data = fs.readFileSync('data.txt').toString().split(/[\n\r]+/).map(x => parseInt(x));
const diffs = data.sort((a, b) => a - b).map((cur, idx, arr) => idx > 0 ? cur - arr[idx - 1] : cur);
const rep = diffs.reduce((acc, diff) => ++acc[diff] && acc, [0, 0, 0, 1]);

function calc(n) {
  return [...Array(n).keys()].reduce((acc, _, idx) => idx < 3 ? [...acc, Math.pow(2, idx)] : [...acc.slice(-2), acc.reduce((a, c) => a + c, 0)], []).pop();
}

const distincts = diffs.join('').match(/1+/g).reduce((acc, cur) => acc * calc(cur.length), 1);

console.log("Part 1", rep[1] * rep[3]);
console.log("Part 2", distincts);