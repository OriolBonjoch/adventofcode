const fs = require('fs');
const data = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]{2}/g);

const template = data[0];
const rules = data
  .slice(2)
  .map((l) => /^(\w+)\s->\s(\w+)$/.exec(l))
  .map((n) => ({ from: n[1], to: n[2] }));

function parse(temp) {
  let result = temp[0];
  for (let i = 0; i < temp.length - 1; i++) {
    const rule = rules.find((r) => r.from === temp.substring(i, i + 2));
    result += `${rule.to}${temp[i + 1]}`;
  }

  return result;
}

function process(times) {
  const finalTemplate = [...Array(times).keys()].reduce((acc, cur) => {
    console.log(`${cur} / ${times}`);
    return parse(acc);
  }, template);

  const res = finalTemplate.split('').reduce((acc, cur) => {
    acc[cur] = acc[cur] ? acc[cur] + 1 : 1;
    return acc;
  }, {});

  console.log(res);
  return {
    max: Math.max(...Object.values(res)),
    min: Math.min(...Object.values(res)),
  };
}

const resP1 = process(10);
console.log('Part 1', resP1.max - resP1.min);

const resP2 = process(40);
console.log('Part 2', resP2.max - resP2.min);
