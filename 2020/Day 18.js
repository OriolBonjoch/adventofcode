const fs = require('fs');

const data = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]+/);

function calculateExpr(expr, rule) {
  if (!rule.test(expr)) return expr;
  return calculateExpr(expr.replace(rule, e => eval(e)), rule);
}

function calculate(expr, ...rules) {
  const calcExpr = (e) => rules.reduce((acc, cur) => calculateExpr(acc, cur), e);
  if (!/\([\d\s+*]+\)/.test(expr)) return parseInt(calcExpr(expr));
  return calculate(expr.replace(/\([\d\s+*]+\)/, e => calcExpr(e.substr(1, e.length - 2))), ...rules);
}

console.log('Part 1', data
  .map(expr => calculate(expr, /(\d+\s*[+*]\s*\d+)/))
  .reduce((acc, cur) => acc + cur, 0));
  
console.log('Part 2', data
  .map(expr => calculate(expr, /(\d+\s*\+\s*\d+)/, /(\d+\s*\*\s*\d+)/))
  .reduce((acc, cur) => acc + cur, 0));