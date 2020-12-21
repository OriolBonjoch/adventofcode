const fs = require('fs');
const data = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]+/g);

const trees = (x, y) => data.reduce((a, c, i) => a + (i % y || c[x * i % c.length] !== '#' ? 0 : 1), 0);
const batch = (t) => t.reduce((a,c) => a * trees(c[0], c[1]),1);

console.log('Part 1', trees(3, 1));
console.log('Part 2', batch([[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]]));
