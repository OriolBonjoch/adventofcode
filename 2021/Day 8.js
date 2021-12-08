const fs = require('fs');

const sortLines = (n) => n.split('').sort().join('');

const data = fs
  .readFileSync('data.txt', 'utf8')
  .split(/[\r\n]{2}/g)
  .map((l) => l.split('|'))
  .map((l) => ({
    input: l[0].trim().split(' ').map(sortLines),
    output: l[1].trim().split(' ').map(sortLines),
  }));

const resP1 = data.reduce(
  (acc, cur) =>
    acc +
    cur.output.filter((n) => [2, 3, 4, 7].indexOf(n.length) !== -1).length,
  0
);
console.log('Part 1', resP1);

const comp = (a, b) => {
  const all = a.split('');
  return b.split('').every((n) => all.indexOf(n) !== -1);
};

function deduce(input) {
  const res = [...Array(10).keys()].map(() => '');
  res[1] = input.find((n) => n.length === 2);
  res[7] = input.find((n) => n.length === 3);
  res[4] = input.find((n) => n.length === 4);
  res[8] = input.find((n) => n.length === 7);

  const posible235 = input.filter((n) => n.length === 5);
  const posible069 = input.filter((n) => n.length === 6);

  res[3] = posible235.find((n) => comp(n, res[1]));
  res[9] = posible069.find((n) => comp(n, res[4]));
  res[6] = posible069.find((n) => !comp(n, res[1]));
  res[5] = posible235.find((n) => comp(res[6], n));
  res[2] = posible235.find((n) => [res[3], res[5]].indexOf(n) === -1);
  res[0] = posible069.find((n) => [res[6], res[9]].indexOf(n) === -1);

  return res;
}

const outputs = data.map((l) => {
  const map = deduce(l.input);
  const res = l.output.map((n) => `${map.indexOf(n)}`).join('');
  return parseInt(res);
});

const resP2 = outputs.reduce((acc, cur) => acc + cur, 0);
console.log('Part 2', resP2);
