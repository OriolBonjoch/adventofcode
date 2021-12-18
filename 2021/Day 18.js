const fs = require('fs');
const data = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]{2}/g);

function explode(content, match, i) {
  const firstMatch = /(\d+)([\[\]\,]*)$/.exec(content.substring(0, i));
  const secondMatch = /^([\[\]\,]*)(\d+)/.exec(
    content.substring(i + match[0].length)
  );

  return (
    (firstMatch
      ? `${content.substring(0, firstMatch.index)}${
          parseInt(firstMatch[1]) + parseInt(match[1])
        }${firstMatch[2]}`
      : content.substring(0, i)) +
    '0' +
    (secondMatch
      ? `${secondMatch[1]}${
          parseInt(secondMatch[2]) + parseInt(match[2])
        }${content.substring(i + match[0].length + secondMatch[0].length)}`
      : content.substring(i + match[0].length))
  );
}

function split(content, match) {
  const n = parseInt(match[1]);
  const n1 = (n - (n % 2)) / 2;
  const n2 = (n + (n % 2)) / 2;
  return (
    content.substring(0, match.index) +
    `[${n1},${n2}]` +
    content.substring(match.index + match[0].length)
  );
}

function parse(content) {
  let level = 0;
  let i = 0;
  while (i < content.length) {
    if (content[i] === '[') level++;
    if (content[i] === ']') level--;

    const explodeMatch = /^\[(\d+),(\d+)\]/.exec(content.substring(i));
    if (level <= 4 || !explodeMatch) {
      i++;
      continue;
    }

    // explode
    return explode(content, explodeMatch, i);
  }

  const splitMatch = /(\d{2,})/.exec(content);
  if (!splitMatch) return null;

  // split
  return split(content, splitMatch);
}

function magnitude(content) {
  while (/\[(\d+),(\d+)\]/.test(content)) {
    content = content.replace(
      /\[(\d+),(\d+)\]/,
      (_, p1, p2) => parseInt(p1) * 3 + parseInt(p2) * 2
    );
  }

  return parseInt(content);
}

function calculate(line) {
  let parsedLine = parse(line);
  while (parsedLine) {
    line = parsedLine;
    parsedLine = parse(line);
  }

  return line;
}

const resP1 = data
  .slice(1)
  .reduce((acc, cur) => calculate(`[${acc},${cur}]`), data[0]);

console.log('Part 1', magnitude(resP1));

const indexes = [...Array(data.length).keys()];
const resP2 = indexes.reduce((acc, i) => {
  const max = indexes
    .filter((j) => j !== i)
    .reduce(
      (a, j) => Math.max(a, magnitude(calculate(`[${data[i]},${data[j]}]`))),
      0
    );
  return Math.max(max, acc);
}, 0);

console.log('Part 2', resP2);
