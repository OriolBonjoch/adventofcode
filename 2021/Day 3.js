const fs = require('fs');
const lines = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]{2}/g);

const gamma = lines
  .map((line) => line.split('').map((v) => parseInt(v)))
  .reduce(
    (acc, cur) => acc.map((v, i) => v + cur[i]),
    lines[0].split('').map((_) => 0)
  )
  .map((v) => (v > lines.length / 2 ? '1' : '0'))
  .join('');

const epsilon = gamma
  .split('')
  .map((v) => 1 - parseInt(v))
  .join('');

console.log('Part 1', parseInt(gamma, 2) * parseInt(epsilon, 2));

let final1 = [...lines];
for (let bit = 0; final1.length > 1 && bit < lines[0].length; bit++) {
  const oneCount = final1.reduce((acc, cur) => acc + parseInt(cur[bit]), 0);
  const halfCount = final1.length / 2;
  const filterValue =
    oneCount === halfCount / 2 ? '1' : oneCount > halfCount / 2 ? '1' : '0';
  final1 = final1.filter((line) => line[bit] === filterValue);
}

const oxygen = parseInt(final1[0], 2);

let final2 = [...lines];
for (let bit = 0; final2.length > 1 && bit < lines[0].length; bit++) {
  const oneCount = final2.reduce((acc, cur) => acc + parseInt(cur[bit]), 0);
  const halfCount = final2.length / 2;
  const filterValue =
    oneCount === halfCount ? '0' : oneCount > halfCount ? '0' : '1';
  final2 = final2.filter((line) => line[bit] === filterValue);
}

const COscrubber = parseInt(final2[0], 2);

console.log('Part 2', oxygen * COscrubber);
