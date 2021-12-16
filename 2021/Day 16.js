const fs = require('fs');
const data = fs
  .readFileSync('data.txt', 'utf8')
  .split('')
  .map((n) => parseInt(n, 16).toString(2))
  .map((n) => '0'.repeat(4 - n.length) + n)
  .join('');

function process(bits, maxCommands) {
  var i = 0;
  var commands = [];
  while (i < bits.length) {
    if (maxCommands && maxCommands === commands.length) return [commands, i];
    if (bits.substring(i).indexOf('1') === -1) return [commands, i];

    var command = {
      version: parseInt(bits.substring(i, i + 3), 2),
      type: parseInt(bits.substring(i + 3, i + 6), 2),
    };

    i += 6;
    if (command.type === 4) {
      let n = '';
      while (bits[i] === '1') {
        n += bits.substring(i + 1, i + 5);
        i += 5;
      }

      n += bits.substring(i + 1, i + 5);
      i += 5;

      command.value = parseInt(n, 2);
    } else if (bits[i] === '0') {
      i++;
      command.length = parseInt(bits.substring(i, i + 15), 2);
      i += 15;
      [command.children] = process(bits.substring(i, i + command.length));
      i += command.length;
    } else {
      i++;
      command.packets = parseInt(bits.substring(i, i + 11), 2);
      i += 11;
      [command.children, moves] = process(
        bits.substring(i),
        command.packets || 0
      );
      i += moves;
    }

    commands.push(command);
  }

  return [commands, i];
}

function sumVersion(commands) {
  return commands.reduce(
    (acc, cur) =>
      acc + cur.version + (cur.children ? sumVersion(cur.children) : 0),
    0
  );
}

const [results] = process(data);

console.log('Part 1', sumVersion(results));

function calculate(command)
{
  if (command.type === 4) {
    return command.value;
  }

  const n = command.children.map(c => calculate(c));
  switch (command.type) {
    case 0: return n.reduce((acc, cur) => acc + cur, 0);
    case 1: return n.reduce((acc, cur) => acc * cur, 1);
    case 2: return n.reduce((acc, cur) => acc < cur ? acc : cur, n[0]);
    case 3: return n.reduce((acc, cur) => acc > cur ? acc : cur, n[0]);

    case 5: return n[0] > n[1] ? 1 : 0;
    case 6: return n[0] < n[1] ? 1 : 0;
    case 7: return n[0] === n[1] ? 1 : 0;
  }
}

console.log('Part 2', results.map(calculate));