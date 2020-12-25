const base = [1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,13,1,19,1,19,9,23,1,5,23,27,1,27,9,31,1,6,31,35,2,35,9,39,1,39,6,43,2,9,43,47,1,47,6,51,2,51,9,55,1,5,55,59,2,59,6,63,1,9,63,67,1,67,10,71,1,71,13,75,2,13,75,79,1,6,79,83,2,9,83,87,1,87,6,91,2,10,91,95,2,13,95,99,1,9,99,103,1,5,103,107,2,9,107,111,1,111,5,115,1,115,5,119,1,10,119,123,1,13,123,127,1,2,127,131,1,131,13,0,99,2,14,0,0];

function program(memory, noun, verb) {
  let i = 0;
  const p = [...memory];
  p[1] = noun;
  p[2] = verb;

  while (i < p.length) {
    const opcode = p[i];
    if (opcode === 99) {
      break;
    }
    
    const a = p[i+1];
    const b = p[i+2];
    const pos = p[i+3];

    if (opcode === 1) {
      p[pos] = p[a] + p[b];
    } else if (opcode === 2) {
      p[pos] = p[a] * p[b];
    }
    
    i += 4;
  }
  
  return {
    result: p[0],
    index: i
  };
}

console.log('Part 1', program(base, 12, 2).result);

for (let i=10; i < 100; i++) {
  for (let j=10; j < 100; j++) {
    const { result } = program(base, i, j);
    if (result === 19690720) {
      console.log('Part 2', `${i*100+j} = ${result} (${19690720 - result})`);
    }
  }
}