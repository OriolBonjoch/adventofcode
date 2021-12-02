const fs = require('fs');
const lines = fs.readFileSync('data.txt', 'utf8')
  .split(/[\r\n]{2}/g);

const commandRegex = /^(forward|down|up)\s+(\d+)$/;
const final1 = lines.map(command => commandRegex.exec(command)).reduce((acc, cur) => {
  return {
    forward: { ...acc, x: acc.x + parseInt(cur[2]) },
    up: { ...acc, y: acc.y - parseInt(cur[2]) },
    down: { ...acc, y: acc.y + parseInt(cur[2]) },
  }[cur[1]];
}, { x: 0, y: 0});

console.log('Part 1', final1.x * final1.y);

const final2 = lines.map(command => commandRegex.exec(command)).reduce((acc, cur) => {
  return {
    forward: { ...acc, x: acc.x + parseInt(cur[2]), y: acc.y + acc.aim * parseInt(cur[2]) },
    up: { ...acc, aim: acc.aim - parseInt(cur[2]) },
    down: { ...acc, aim: acc.aim + parseInt(cur[2]) },
  }[cur[1]];
}, { x: 0, y: 0, aim: 0});

console.log('Part 2', final2.x * final2.y);