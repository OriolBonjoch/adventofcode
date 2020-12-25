const fs = require('fs');

const content = fs.readFileSync('data.txt', 'utf8');
const regex = /^(\d+)\-(\d+)\s+(\w):\s*(\w+)$/gm
let validV1 = 0;
let validV2 = 0;
let m;
while ((m = regex.exec(content)) !== null) {
  const n1 = parseInt(m[1]);
  const n2 = parseInt(m[2]);
  
  const letter = m[3];
  const password = m[4];
  
  const regexPart1 = new RegExp(`^[^${letter}]*(${letter}[^${letter}]*){${n1},${n2}}$`);
  if (regexPart1.test(password)) {
    validV1++;
  }

  const regexPart2 = new RegExp(`^(\\w{${n1-1}}${letter}\\w{${n2-n1-1}}[^${letter}]|\\w{${n1-1}}[^${letter}]\\w{${n2-n1-1}}${letter})`);
  if (regexPart2.test(password)) {
    validV2++;
  }
}

console.log('Part 1:', validV1); // 416
console.log('Part 2:', validV2); // 688