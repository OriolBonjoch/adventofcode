const fs = require('fs');
const data = fs
  .readFileSync('data.txt', 'utf8')
  .split(/[\r\n]{2}/g)
  .map((l) => l.split('').map((n) => parseInt(n)));

const forEachInMatrix = (matrix, callback) => {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      callback(i, j);
    }
  }
};

const light = (matrix, i, j) => {
  if (i < 0 || i >= matrix.length || j < 0 || j >= matrix[0].length) return;
  if (matrix[i][j] > 9) return;
  matrix[i][j] = matrix[i][j] + 1;
};

function flashes(matrix) {
  forEachInMatrix(matrix, (i, j) => light(matrix, i, j));

  let stepLight = true;
  while (stepLight) {
    stepLight = false;
    forEachInMatrix(matrix, (i, j) => {
      if (matrix[i][j] !== 10) return;
      stepLight = true;
      matrix[i][j] = 11;
      light(matrix, i - 1, j - 1);
      light(matrix, i, j - 1);
      light(matrix, i + 1, j - 1);
      light(matrix, i - 1, j);
      light(matrix, i + 1, j);
      light(matrix, i - 1, j + 1);
      light(matrix, i, j + 1);
      light(matrix, i + 1, j + 1);
    });
  }

  let total = 0;
  forEachInMatrix(matrix, (i, j) => {
    if (matrix[i][j] > 9) {
      matrix[i][j] = 0;
      total++;
    }
  });

  return total;
}

const dataP1 = [...data.map((l) => [...l])];
const resP1 = [...Array(100).keys()].reduce((acc) => acc + flashes(dataP1), 0);
console.log('Part 1', resP1);

const dataP2 = [...data.map((l) => [...l])];
let resP2 = 1;
while (flashes(dataP2) < dataP2.length * dataP2[0].length) resP2++;
console.log('Part 2', resP2);
