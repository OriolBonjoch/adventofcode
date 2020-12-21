const fs = require('fs');

const lineRule = /^(acc|nop|jmp)\s([-+]\d+)$/;

const lines = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]{2}/g);
function execute(program, accumulator = 0, i = 0) {
  const callstack = [];
  while (i < program.length) {
    if (callstack.some(x => x.i === i)) {
      return { accumulator, callstack };
    }

    callstack.push({ accumulator, i });
    const line = program[i];
    const match = lineRule.exec(line);
    const operation = match[1];
    const argument = parseInt(match[2]);
    if (operation === 'acc') {
      accumulator += argument;
    }

    i += operation === 'jmp' ? argument : 1;
  }

  return { accumulator };
}

const result = execute(lines);
console.log("Part 1", result.accumulator);

result.callstack.reverse().forEach(stack => {
  const command = lines[stack.i];
  if (command.startsWith('acc')) {
    return;
  }

  inst = command.startsWith('nop') ? 'jmp' : 'nop';
  const program = [...lines]
  program[stack.i] = `${inst}${command.substr(3)}`;
  const res = execute(program, stack.accumulator, stack.i);
  if (!res.callstack) {
    console.log('Part 2', res.accumulator);
    return;
  }
});