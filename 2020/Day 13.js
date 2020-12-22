const fs = require('fs');
const data = fs.readFileSync('data.txt', 'utf8')
  .split(/[\r\n,]+/g);

const earliest = parseInt(data[0]);
const busses = data.slice(1)
  .map((num, i) => ({ num, i }))
  .filter(x => x.num !== 'x')
  .map(cur => ({ ...cur, num: parseInt(cur.num) }));

const nextBus = busses.map(bus => ({ id: bus.num, next: earliest + bus.num - (earliest % bus.num)}));
const min = nextBus.reduce((acc, cur, i) => acc && acc.next < cur.next ? acc : cur, null);

function calc(busses) {
  // all busses must be prime
  let lcm = busses[0].num;
  let result = 0;
  for (let i = 1; i < busses.length; i++) {
    const current = busses[i];
    const max = current.num * lcm + result;
    for (let x = result; x <= max; x += lcm ) {
      if ((x + current.i) % current.num === 0) {
        lcm *= current.num;
        result = x;
        break;
      }
    }
  }

  return result;
}

console.log('Part 1', min.id * (min.next - earliest));
console.log('Part 2', calc(busses));