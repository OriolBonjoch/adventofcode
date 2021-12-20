const fs = require('fs');
const data = fs
  .readFileSync('data.txt', 'utf8')
  .split(/[\r\n]{4}/g)
  .map((cur) => {
    const beacons = cur.split(/[\r\n]{2}/g).slice(1);
    const scanner = parseInt(/--- scanner (\d+) ---/.exec(cur)[1]);
    return {
      scanner,
      beacons: beacons
        .map((line) => /^(-?\d+),(-?\d+),(-?\d+)$/.exec(line))
        .map((match) => [1, 2, 3].map((i) => parseInt(match[i]))),
    };
  });

const posibles = [0, 1, 2].flatMap((n) => [
  { bi: n, mult: 1 },
  { bi: n, mult: -1 },
]);

function getPosition(pairs, ai) {
  for (let i = 0; i < posibles.length; ++i) {
    const { bi, mult } = posibles[i];
    const diff = pairs[0].fromA[ai] + mult * pairs[0].fromB[bi];
    let isOk = true;
    for (let pi = 1; pi < pairs.length && isOk; ++pi) {
      const p = pairs[pi];
      if (p.fromA[ai] + mult * p.fromB[bi] !== diff) isOk = false;
    }

    if (isOk) {
      return { diff, mult, i: bi };
    }
  }

  return null;
}

function findMatches(aBeacons, bBeacons) {
  const pairs = [];
  for (let ai = 0; ai < aBeacons.length; ++ai) {
    const aRelatives = aBeacons
      .map((b) => b.map((p, i) => aBeacons[ai][i] - p))
      .map((b) => b.reduce((acc, cur) => cur * cur + acc, 0))
      .sort((a, b) => a - b);

    for (let bi = 0; bi < bBeacons.length; bi++) {
      const bRelatives = bBeacons
        .map((b) => b.map((p, i) => bBeacons[bi][i] - p))
        .map((b) => b.reduce((acc, cur) => cur * cur + acc, 0))
        .sort((a, b) => a - b);

      if (aRelatives.filter((b) => bRelatives.includes(b)).length >= 12) {
        pairs.push({
          fromA: aBeacons[ai],
          fromAIndex: ai,
          fromB: bBeacons[bi],
          fromBIndex: bi,
        });
      }
    }
  }

  if (pairs.length < 12) return [];

  const scanCalc = [0, 1, 2].map((p) => getPosition(pairs, p));
  const modifiedBPoints = bBeacons
    .filter((_, i) => pairs.every((p) => p.fromBIndex !== i))
    .map((b) =>
      [0, 1, 2].map(
        (i) => scanCalc[i].diff - b[scanCalc[i].i] * scanCalc[i].mult
      )
    );

  return [modifiedBPoints, scanCalc.map((p) => p.diff)];
}

function calculate(beacons, scanners) {
  const pending = [];
  const scanPositions = [];
  for (let i = 0; i < scanners.length; ++i) {
    const scanner = scanners[i];
    const [res, point] = findMatches(beacons, scanner.beacons);
    if (res) {
      beacons.push(...res);
      scanPositions.push(point);
    } else {
      pending.push(scanner);
    }
  }

  if (pending.length) {
    const [res, scanPos] = calculate(beacons, pending);
    return [res, [...scanPos, ...scanPositions]];
  }

  return [beacons, scanPositions];
}

const [resP1, scanners] = calculate(data[0].beacons, data.slice(1));

console.log('Part 1', resP1.length);

function calculateMaxDist(scannerPoints) {
  let result = 0;
  for (let i = 0; i < scannerPoints.length; ++i) {
    for (let j = i + 1; j < scannerPoints.length; ++j) {
      const dist = [0, 1, 2].reduce(
        (acc, cur) =>
          acc + Math.abs(scannerPoints[i][cur] - scannerPoints[j][cur]),
        0
      );

      if (result < dist) result = dist;
    }
  }

  return result;
}

console.log('Part 2', calculateMaxDist(scanners));
