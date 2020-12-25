const fs = require('fs');

const lineRule = /^([ \w]+) bags contain (.*)\.$/;
const reqRule = /(\d+) ([\s\w]+) bags?/g;

const lines = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]{2}/g);
const rules = {};
lines.forEach(line => {
  const match = lineRule.exec(line);
  if (!match) {
    throw new Error(line);
  }
  
  const bagColor = match[1];
  const requirements = match[2];
  if (requirements == "no other bags") {
    return;
  }

  let m;
  while (m = reqRule.exec(requirements)) {
    const count = m[1];
    const color = m[2];
    if (!rules[bagColor]) rules[bagColor] = { in: {}, out: {}};
    if (!rules[color]) rules[color] = { in: {}, out: {}};
    rules[bagColor].in[color] = count;
    rules[color].out[bagColor] = true;
  }
});

function calculateOutside(color) {
  return Object.keys(rules[color].out).reduce((acc, cur) => ({ ...acc, ...calculateOutside(cur)}), {...rules[color].out});
}

function calculateBags(color) {
  let result = 1;
  Object.keys(rules[color].in).forEach(c => {
    result += rules[color].in[c] * calculateBags(c);
  })

  return result;
}

console.log("Part 1", Object.keys(calculateOutside('shiny gold')).length);
console.log("Part 2", calculateBags('shiny gold') - 1);