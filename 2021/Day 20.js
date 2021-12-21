const fs = require('fs');
const data = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]{2}/g);
const imageEnhancement = data[0];
const inputImage = data.slice(2).map((l) => l.split(''));

function getSquare(image, pi, pj, step) {
  const empty =
    imageEnhancement[0] === '.'
      ? '0'
      : imageEnhancement[511] === '.'
      ? step % 2 ? '1' : '0'
      : step ? '1' : '0';
  const binary = [pi - 1, pi, pi + 1]
    .flatMap((i) =>
      i < 0 || i >= image.length
        ? [empty, empty, empty]
        : [pj - 1, pj, pj + 1].map((j) =>
            j < 0 || j >= image.length ? empty : image[i][j] === '.' ? '0' : '1'
          )
    )
    .join('');

  return parseInt(binary, 2);
}

function enhanceImage(input, step) {
  const output = [...Array(input.length + 2).keys()].map((i) =>
    [...Array(input[0].length + 2).keys()].map((j) => {
      const n = getSquare(input, i - 1, j - 1, step);
      return imageEnhancement[n];
    })
  );

  return output;
}

const resP1 = [0, 1]
  .reduce((acc, cur) => enhanceImage(acc, cur), inputImage)
  .reduce((acc, cur) => acc + cur.join('').split('#').length - 1, 0);

console.log('Part 1', resP1);

const resP2 = [...Array(50).keys()]
  .reduce((acc, cur) => enhanceImage(acc, cur), inputImage)
  .reduce((acc, cur) => acc + cur.join('').split('#').length - 1, 0);

console.log('Part 2', resP2);
