const data = [9, 19, 1, 6, 0, 5, 4];

function calc(startData, max) {
  let i = startData.length - 1;
  const history = startData.reduce((acc, cur, idx) => idx < startData.length - 1 ? { ...acc, [cur]: idx } : acc, {});
  let last = startData.slice(-1)[0].toString();
  console.time(`day 15 - ${max} pos`);
  
  while (i < max - 1) {
    let next = history[last] === undefined ? 0 : i - history[last];
    history[last] = i++;
    last = next.toString();
  }

  console.timeEnd(`day 15 - ${max} pos`);
  return last;
}

console.log('Part 1', calc(data, 2020));
console.log('Part 2', calc(data, 30000000));

/*
day 15 - 2020 pos: 0.649ms
Part 1 1522
day 15 - 30000000 pos: 9:55.189 (m:ss.mmm)
Part 2 18234
*/