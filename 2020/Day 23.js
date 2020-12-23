const data = '123487596'.split('').map(x => parseInt(x));

const prettyPrint = (cups, cur) => cups.map((x, i) => i === cur ? `(${x})` : x).join(' ');
const print = (cups) => parseInt([...cups.slice(cups.indexOf(1) +1), ...cups.slice(0, cups.indexOf(1))].join(''));

function calculate(cups, current, move) {
  if (!move) return cups;
  current %= cups.length;
  // console.log(prettyPrint(cups, current));
  const picks = cups.slice(current+1, current+4);
  const remaining = [...cups.slice(0, current+1), ...cups.slice(current+4)].slice(3-picks.length);
  picks.push(...cups.slice(0, 3-picks.length));
  const d = remaining.filter(x => x < cups[current]);
  const dest = d.length ? Math.max(...d) : Math.max(...remaining);
  const next = [...remaining.slice(0,remaining.indexOf(dest)+1), ...picks, ...remaining.slice(remaining.indexOf(dest)+1)];
  const diff = next.indexOf(cups[current]) - current;

  // console.log(' - picks', picks);
  // console.log(' - dest', dest);
  // console.log(' - diff', diff);
  // console.log('remaining', remaining);
  return calculate(
    [...next.slice(diff), ...next.slice(0, diff)],
    current + 1,
    move -1);
}


const result = calculate(data, 0, 100);
console.log('Part 1', print(result));