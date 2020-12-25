const fs = require('fs');
const pad = (n, len) => (new Array(len + 1).join('0') + n).slice(-len);

const createMask = (m) => ({ cmd: m[1], value: pad(m[2].substr(3), 36) });
const createMem = (m) => {
  const mem = /^\[(\d+)\] = (\d+)$/.exec(m[2]);
  return { cmd: m[1], pos: parseInt(mem[1]), value: parseInt(mem[2]) };
};

const data = fs.readFileSync('data.txt', 'utf8')
  .split(/[\r\n]+/g)
  .map(x => /^(mem|mask)(.*)$/.exec(x))
  .map(m => m[1] === 'mem' ? createMem(m) : createMask(m));

function calc1(program) {
  const applyMask = (num, mask) => num.split('').map((x, i) => mask[i] === 'X' ? x : mask[i]).join('');
  const mem = {};
  let mask = new Array(37).join('X');
  for (let i = 0; i < program.length; i++) {
    const p = program[i];
    switch (p.cmd) {
      case 'mask':
        mask = pad(p.value.toString(2), 36);
        break;
      case 'mem':
        mem[p.pos] = parseInt(applyMask(pad(p.value.toString(2), 36), mask), 2);
        break;
    }
  }

  return Object.values(mem).reduce((acc, cur) => acc+cur, 0);
}

const getBaseAddress = (address, mask) => address.split('').map((x, i) => mask[i] === '1'  ? '1' : (mask[i] === 'X' ? '0' : x)).join('');
const getFloatingPoints = (mask) => mask.split('').map((num, i) => ({ num, i})).filter(x => x.num === 'X').map(x => Math.pow(2, mask.length - parseInt(x.i) - 1));

function decodeMemories(base, floatings) {
  if (!floatings.length) {
    return [ base ];
  }

  const current = floatings[0];
  return [
    ...decodeMemories(base, floatings.slice(1)),
    ...decodeMemories(base + current, floatings.slice(1))
  ];
}

function calc2(program) {
  const mem = {};
  let mask = new Array(37).join('0');
  for (let i = 0; i < program.length; i++) {
    const p = program[i];
    switch (p.cmd) {
      case 'mask':
        mask = pad(p.value.toString(2), 36);
        break;
      case 'mem':
        const floatings = getFloatingPoints(mask);
        const baseAddr = parseInt(getBaseAddress(pad(p.pos.toString(2), 36), mask), 2);
        const addresses = decodeMemories(baseAddr, floatings);
        for (const addr of addresses) {
          mem[addr] = p.value;
        }

        break;
    }
  }

  return Object.values(mem).reduce((acc, cur) => acc+cur, 0);
}

console.log('Part 1', calc1(data));
console.log('Part 2', calc2(data));