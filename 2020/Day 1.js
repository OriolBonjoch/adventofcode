const fs = require('fs');
const lines = fs.readFileSync('data.txt', 'utf8')
  .split(/[\r\n]{2}/g)
  .map(x => parseInt(x))
  .sort((a, b) => a- b);

const sum = (n) => n.reduce((acc, cur) => acc + cur, 0);
const mult = (n) => n?.reduce((acc, cur) => acc * cur, 1);

function search(numbers, target, n, acc = [], i0 = 0) {
  if (n === 0) {
    return sum(acc) === target ? [...acc] : null;
  }

  for (let i = i0; i < numbers.length && sum(acc) + numbers[i] <= target;  i++) {
    const result = search(numbers, target, n - 1, [...acc, numbers[i]], i0 = i + 1);
    if (result) {
      return result;
    }
  }
}

console.log('Part 1', mult(search(lines, 2020, 2)));
console.log('Part 2', mult(search(lines, 2020, 3)));