const fs = require('fs');

const data = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]{4}/);
const messages = data[1].split(/[\r\n]+/);

const parseRule = (line) => {
  const m = line.match(/^(\d+): (.*)$/);
  return { num: parseInt(m[1]), rawRule: m[2]};
}

const parseCharRule = (rule) => {
  const m = rule.rawRule.match(/\"(\w)\"/);
  if (!m) return null;
  return { num: rule.num, text: m[1] };
}

const parseSubRule = (rule) => {
  const subRules = rule.rawRule.split(/\s*\|\s*/).map(r => r.split(/\s/).map(n => parseInt(n)));
  return { num: rule.num, subRules };
}

const rules = data[0].split(/[\r\n]+/)
  .map(l => parseRule(l))
  .map(rule => parseCharRule(rule) || parseSubRule(rule))
  .reduce((acc, cur) => ({...acc, [cur.num]: {...cur}}), []);

function processRule(rules, n) {
  if (rules[n].text) return rules[n].text;
  const expr = rules[n].subRules.map(subRule => subRule.map(i => processRule(rules, i)).join('')).reduce((acc, cur) => acc + `|${cur}`, '');
  if (/^(\|\w)+$/.test(expr)) return `[${expr.replace(/\|/g, '')}]`;
  return `(${expr.substr(1)})`;
}

function calculate(message, rules, n) {
  return new RegExp(`^${processRule(rules, n)}$`).test(message);
}

console.log('Part 1', messages.filter(m => calculate(m, rules, 0)).length);

function doLoop(rule, depth) {
  if (depth === 0) return rule.filter(n => n);
  const i = rule.indexOf(0);
  return [...rule.slice(0, i), ...doLoop(rule, depth -1), ...rule.slice(i+1)];
}

function repeatLoop(rule, times) {
  return [...Array(times).keys()].map(i => doLoop(rule, i));
}


const rulesP2 = {...rules};
rulesP2[8] = { num: 8, subRules: repeatLoop([42, 0], 6)};
rulesP2[11] = { num: 11, subRules: repeatLoop([42, 0, 31], 6)};
console.log('Part 2', messages.filter(m => calculate(m, rulesP2, 0)).length);