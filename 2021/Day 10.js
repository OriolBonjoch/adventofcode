const fs = require('fs');
const data = fs
  .readFileSync('data.txt', 'utf8')
  .split(/[\r\n]{2}/g)
  .map((l) => l.split(''));

const incorrectPoints = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
};

function parseLine(line) {
  const expected = [];

  for (let i = 0; i < line.length; i++) {
    const index = '([{<'.indexOf(line[i]);
    if (index !== -1) {
      expected.push(')]}>'[index]);
    } else {
      const c = expected.pop();
      if (line[i] !== c) {
        return line[i];
      }
    }
  }

  return expected.reverse();
}

const parsedLines = data.map(parseLine);
const incorrect = parsedLines.filter(l => typeof l === 'string');
const resP1 = incorrect.map(l => incorrectPoints[l]).reduce((a, c) => a + c, 0);

console.log('Part 1', resP1);

const incompletePoints = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4
};


const incomplete = parsedLines.filter(l => typeof l !== 'string');
const resP2 = incomplete.map(l => l.reduce((acc, cur) => acc * 5 + incompletePoints[cur], 0)).sort((a, b ) => a - b);

console.log('Part 2', resP2[(resP2.length - 1) / 2]);