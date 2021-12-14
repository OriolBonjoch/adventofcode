const fs = require('fs');
const data = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]{2}/g);

const foldInstructions = data.findIndex((l) => !l);
const points = data
  .slice(0, foldInstructions)
  .map((l) => l.split(',').map((n) => parseInt(n)));
const fold = data.slice(foldInstructions + 1).map((l) => {
  const m = /^fold along (x|y)=(\d+)$/.exec(l);
  return { along: m[1], p: parseInt(m[2]) };
});

const width = fold.find((l) => l.along === 'x').p * 2 + 1;
const height = fold.find((l) => l.along === 'y').p * 2 + 1;

const paper = [...Array(width).keys()].map(() =>
  [...Array(height).keys()].map((_) => '.')
);

for (let i = 0; i < points.length; i++) {
  const p = points[i];
  paper[p[0]][p[1]] = '#';
}

function foldPaper(input, fold) {
  const w = fold.along === 'x' ? fold.p : input.length;
  const h = fold.along === 'y' ? fold.p : input[0].length;
  const output = [...Array(w).keys()].map((_, x) =>
    [...Array(h).keys()].map((_, y) => input[x][y])
  );

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const hasPoint =
        fold.along === 'x'
          ? input[fold.p * 2 - x][y] === '#'
          : input[x][fold.p * 2 - y] === '#';

      if (hasPoint) {
        output[x][y] = '#';
      }
    }
  }

  return output;
}

function count(input) {
  let count = 0;
  for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[0].length; y++) {
      if (input[x][y] === '#') count++;
    }
  }

  return count;
}

const resP1 = foldPaper(paper, fold[0]);
console.log('Part 1', count(resP1));

const resP2 = fold.reduce((acc, f) => foldPaper(acc, f), paper);
const flipped = resP2[0].map((_, i) => resP2.map((l) => l[i]));
flipped.map((l) => console.log(l.join('')));
console.log('Part 2', 'LRGPRECB');
