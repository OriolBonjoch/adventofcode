const fs = require('fs');

const data = fs.readFileSync('data.txt').toString().split(/[\n\r]+/);
const degrees_to_radians = (degrees) => degrees * (Math.PI/180);
const manhattan = (x, y) => Math.abs(x) + Math.abs(y);
const to_polar = (x, y) => {
  const ori = Math.atan2(y, x);
  const abs = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
  return { ori, abs };
}

const move = {
  N: (state, n) => ({...state, y: state.y + n}),
  S: (state, n) => ({...state, y: state.y - n}),
  E: (state, n) => ({...state, x: state.x + n}),
  W: (state, n) => ({...state, x: state.x - n}),
  L: (state, n) => ({...state, look: state.look + degrees_to_radians(n)}),
  R: (state, n) => ({...state, look: state.look - degrees_to_radians(n)}),
  F: (state, n) => ({
    look: state.look,
    x: Math.round(state.x + Math.cos(state.look) * n),
    y: Math.round(state.y + Math.sin(state.look) * n)
  })
};

const resultP1 = data.map(line => /^([NSEWLRF])(\d+)$/.exec(line)).reduce((acc, m) => move[m[1]](acc, parseInt(m[2])), { x: 0, y: 0, look: 0 });
console.log('Part 1', manhattan(resultP1.x, resultP1.y));

function rotate(x, y, degrees) {
  const polar = to_polar(x, y);
  polar.ori += degrees_to_radians(degrees);
  return {
    x: Math.round(polar.abs * Math.cos(polar.ori)),
    y: Math.round(polar.abs * Math.sin(polar.ori))
  };
}

const wMove = {
  N: (state, n) => ({...state, wy: state.wy + n}),
  S: (state, n) => ({...state, wy: state.wy - n}),
  E: (state, n) => ({...state, wx: state.wx + n}),
  W: (state, n) => ({...state, wx: state.wx - n}),
  L: (state, n) => {
    const p = rotate(state.wx, state.wy, n);
    return {...state, wx: p.x, wy: p.y };
  },
  R: (state, n) => {
    const p = rotate(state.wx, state.wy, -n);
    return {...state, wx: p.x, wy: p.y };
  },
  F: (state, n) => ({
    ...state,
    x: state.x + state.wx * n,
    y: state.y + state.wy * n
  })
};

const resultP2 = data.map(line => /^([NSEWLRF])(\d+)$/.exec(line)).reduce((acc, m) => wMove[m[1]](acc, parseInt(m[2])), { x: 0, y: 0, wx: 10, wy: 1 });
console.log('Part 2', manhattan(resultP2.x, resultP2.y));