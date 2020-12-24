const init = '123487596'.split('').map(x => parseInt(x));
const data = init.reduce((acc, cur, idx, arr) => {
  acc[cur] = arr[(idx + 1) % arr.length];
  return acc;
}, [ init[0] ]);

function prettyPrint(cups, max = -1)
{
  let result = `(${cups[0]})`;
  let pointer = cups[cups[0]];
  while (pointer !== cups[0] && max-- !== 0) {
    result += ` ${pointer}`;
    pointer = cups[pointer];
  }

  return result.trimEnd();
}

function print(cups)
{
  let result = '';
  let pointer = cups[1];
  while (pointer !== 1) {
    result += `${pointer}`;
    pointer = cups[pointer];
  }

  return parseInt(result);
}

function calculate(cups, move) {
  while (move--)
  {
    const picks = [0,1,2].reduce(acc => ({
      pointer: cups[acc.pointer],
      result: [...acc.result, acc.pointer]
    }), { pointer: cups[cups[0]], result: [] }).result;
    let dest = cups[0] === 1 ? cups.length - 1 : cups[0] - 1;
    while (picks.includes(dest)) {
      dest = dest === 1 ? cups.length - 1 : dest - 1;
    }

    const orig = cups[0];
    
    cups[orig] = cups[picks[2]];
    cups[picks[2]] = cups[dest];
    cups[dest] = picks[0];
    cups[0] = cups[orig];
  }

  return cups;
}

function fillData(initial, total) {
  const data = [...initial];
  data[data.lastIndexOf(data[0])] = data.length;
  for (let i = data.length; i <= total; ++i) {
    data.push(i === total ? data[0] : i + 1);
  }

  return data;
}

const resultP1 = calculate([...data], 100);
console.log('Part 1', print(resultP1));

const crabData = fillData([...data], 1000000);
const resultP2 = calculate(crabData, 10000000);

const first = resultP2[1];
const second = resultP2[first];
console.log('Part 2', first * second);