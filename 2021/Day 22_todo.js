const fs = require('fs');
const data = fs
  .readFileSync('data.txt', 'utf8')
  .split(/[\r\n]{2}/g)
  .map((l) =>
    /^(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)$/.exec(
      l
    )
  )
  .map((m) => ({
    on: m[1] === 'on',
    x: [parseInt(m[2]), parseInt(m[3])],
    y: [parseInt(m[4]), parseInt(m[5])],
    z: [parseInt(m[6]), parseInt(m[7])],
  }));

const buildMatrix = (x, y, z) =>
  [...Array(x).keys()].map((_) =>
    [...Array(y).keys()].map((_) => [...Array(z).keys()].map((_) => false))
  );

function check(cube, innerCube) {
  if (
    cube.x[0] <= innerCube.x[0] &&
    cube.y[0] <= innerCube.y[0] &&
    cube.z[0] <= innerCube.z[0] &&
    cube.x[1] >= innerCube.x[1] &&
    cube.y[1] >= innerCube.y[1] &&
    cube.z[1] >= innerCube.z[1]
  ) {
    return true;
  }

  return false;
}

function countAll(cubes) {
  const xSplits = new Set();
  const ySplits = new Set();
  const zSplits = new Set();
  for (let i = 0; i < cubes.length; ++i) {
    cubes[i].x.forEach((n) => xSplits.add(n));
    cubes[i].y.forEach((n) => ySplits.add(n));
    cubes[i].z.forEach((n) => zSplits.add(n));
  }

  const x = [...xSplits].sort((a, b) => a - b);
  const y = [...ySplits].sort((a, b) => a - b);
  const z = [...zSplits].sort((a, b) => a - b);
  const litArea = buildMatrix(x.length - 1, y.length - 1, z.length - 1);
  const litxBorders = buildMatrix(x.length, y.length - 1, z.length - 1);
  const lityBorders = buildMatrix(x.length - 1, y.length, z.length - 1);
  const litzBorders = buildMatrix(x.length - 1, y.length - 1, z.length);
  const litxLines = buildMatrix(x.length - 1, y.length, z.length);
  const lityLines = buildMatrix(x.length, y.length - 1, z.length);
  const litzLines = buildMatrix(x.length, y.length, z.length - 1);
  const litPoints = buildMatrix(x.length, y.length, z.length);

  console.log(x.length, y.length, z.length);
  for (let cube of cubes) {
    for (let i = 0; i < x.length; ++i) {
      for (let j = 0; j < y.length; ++j) {
        for (let k = 0; k < z.length; ++k) {
          if (
            check(cube, {
              x: [x[i], x[i]],
              y: [y[j], y[j]],
              z: [z[k], z[k]],
            })
          ) {
            litPoints[i][j][k] = cube.on;
          }

          if (
            i > 0 &&
            check(cube, {
              x: [x[i - 1], x[i]],
              y: [y[j], y[j]],
              z: [z[k], z[k]],
            })
          ) {
            litxLines[i - 1][j][k] = cube.on;
          }

          if (
            j > 0 &&
            check(cube, {
              x: [x[i], x[i]],
              y: [y[j - 1], y[j]],
              z: [z[k], z[k]],
            })
          ) {
            lityLines[i][j - 1][k] = cube.on;
          }

          if (
            k > 0 &&
            check(cube, {
              x: [x[i], x[i]],
              y: [y[j], y[j]],
              z: [z[k - 1], z[k]],
            })
          ) {
            litzLines[i][j][k - 1] = cube.on;
          }

          if (
            j > 0 &&
            k > 0 &&
            check(cube, {
              x: [x[i], x[i]],
              y: [y[j - 1], y[j]],
              z: [z[k - 1], z[k]],
            })
          ) {
            litxBorders[i][j - 1][k - 1] = cube.on;
          }

          if (
            i > 0 &&
            k > 0 &&
            check(cube, {
              x: [x[i - 1], x[i]],
              y: [y[j], y[j]],
              z: [z[k - 1], z[k]],
            })
          ) {
            lityBorders[i - 1][j][k - 1] = cube.on;
          }

          if (
            i > 0 &&
            j > 0 &&
            check(cube, {
              x: [x[i - 1], x[i]],
              y: [y[j - 1], y[j]],
              z: [z[k], z[k]],
            })
          ) {
            litzBorders[i - 1][j - 1][k] = cube.on;
          }

          if (
            i > 0 &&
            j > 0 &&
            k > 0 &&
            check(cube, {
              x: [x[i - 1], x[i]],
              y: [y[j - 1], y[j]],
              z: [z[k - 1], z[k]],
            })
          ) {
            litArea[i - 1][j - 1][k - 1] = cube.on;
          }
        }
      }
    }
  }

  let count = 0;
  for (let i = 0; i < x.length; ++i) {
    for (let j = 0; j < y.length; ++j) {
      for (let k = 0; k < z.length; ++k) {
        if (litPoints[i][j][k]) {
          count++;
        }

        if (i > 0 && litxLines[i - 1][j][k]) {
          count += x[i] - x[i - 1] - 1;
        }

        if (j > 0 && lityLines[i][j - 1][k]) {
          count += y[j] - y[j - 1] - 1;
        }

        if (k > 0 && litzLines[i][j][k - 1]) {
          count += z[k] - z[k - 1] - 1;
        }

        if (j > 0 && k > 0 && litxBorders[i][j - 1][k - 1]) {
          count += (y[j] - y[j - 1] - 1) * (z[k] - z[k - 1] - 1);
        }

        if (i > 0 && k > 0 && lityBorders[i - 1][j][k - 1]) {
          count += (x[i] - x[i - 1] - 1) * (z[k] - z[k - 1] - 1);
        }

        if (i > 0 && j > 0 && litzBorders[i - 1][j - 1][k]) {
          count += (x[i] - x[i - 1] - 1) * (y[j] - y[j - 1] - 1);
        }

        if (i > 0 && j > 0 && k > 0 && litArea[i - 1][j - 1][k - 1]) {
          count +=
            (x[i] - x[i - 1] - 1) *
            (y[j] - y[j - 1] - 1) *
            (z[k] - z[k - 1] - 1);
        }
      }
    }
  }

  return count;
}

const resP1 = countAll(
  data.filter(
    (c) =>
      c.x.every((n) => n >= -50 && n <= 50) &&
      c.y.every((n) => n >= -50 && n <= 50) &&
      c.z.every((n) => n >= -50 && n <= 50)
  )
);

console.log('Part 1', resP1);

const resP2 = countAll(data);

console.log('Part 2', resP2);
