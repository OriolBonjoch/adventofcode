const fs = require('fs');
const data = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]{2}/g);

const template = data[0]
  .split('')
  .slice(1)
  .map((_, i) => data[0].substring(i, i + 2))
  .reduce((acc, cur) => {
    acc[cur] = acc[cur] ? acc[cur] + 1 : 1;
    return acc;
  }, {});

const rules = data
  .slice(2)
  .map((l) => /^(\w+)\s->\s(\w+)$/.exec(l))
  .reduce(
    (acc, [_, rule, mapped]) => ({
      ...acc,
      [rule]: [
        `${rule.substring(0, 1)}${mapped}`,
        `${mapped}${rule.substring(1, 2)}`,
      ],
    }),
    {}
  );

function parse(temp) {
  const result = Object.keys(temp).reduce((acc, cur) => {
    const reps = temp[cur];
    const [first, second] = rules[cur];
    acc[first] = acc[first] ? acc[first] + reps : reps;
    acc[second] = acc[second] ? acc[second] + reps : reps;
    return acc;
  }, {});

  return result;
}

function process(t, times) {
  const finalTemplate = [...Array(times).keys()].reduce(parse, t);
  const res = Object.keys(finalTemplate).reduce((acc, cur) => {
    const [a, b] = cur.split('');
    const count = finalTemplate[cur];
    acc[a] = acc[a] ? acc[a] + count : count;
    acc[b] = acc[b] ? acc[b] + count : count;
    return acc;
  }, { [data[0].substring(0, 1)]: 1,
    [data[0].substring(data[0].length - 1)]: 1
  });
  return {
    max: Math.max(...Object.values(res)) / 2,
    min: Math.min(...Object.values(res)) / 2,
  };
}

const resP1 = process(template, 10);
console.log('Part 1', resP1.max - resP1.min);

const resP2 = process(template, 40);
console.log('Part 2', resP2.max - resP2.min);
