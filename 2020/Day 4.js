const fs = require('fs');

const data = fs.readFileSync('data.txt');
const passportReg = /(?!\n)([\w:# ]|\n(?!\n))+/g;
const fieldsReg = /\b(\w{3}):(\S+)\b/g;
let total = 0;
let valid = 0;

const validators = {
  byr: (val) => /^\d{4}$/.test(val) && parseInt(val) >= 1920 && parseInt(val) <= 2002,
  iyr: (val) => /^\d{4}$/.test(val) && parseInt(val) >= 2010 && parseInt(val) <= 2020,
  eyr: (val) => /^\d{4}$/.test(val) && parseInt(val) >= 2020 && parseInt(val) <= 2030,
  hgt: (val) => (/^\d{3}cm$/.test(val) && parseInt(val.substr(0, 3)) >= 150 && parseInt(val.substr(0, 3)) <= 193)
    || (/^\d{2}in$/.test(val) && parseInt(val.substr(0, 2)) >= 59 && parseInt(val.substr(0, 2)) <= 76),
  hcl: (val) => /^#[\da-f]{6}$/.test(val),
  ecl: (val) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(val),
  pid: (val) => /^\d{9}$/.test(val)
};

const mandatory = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
while ((passport = passportReg.exec(data.toString())) !== null) {
  const has = [];
  let isValid = true;
  while ((field = fieldsReg.exec(passport)) !== null) {
    has.push(field[1]);
    const validator = validators[field[1]];
    if (validator && !validator(field[2])) {
      isValid = false;
    }
  }

  const missing = mandatory.filter(f => !has.includes(f));
  if (missing.length === 0 && isValid) valid++;
  total++;
}

console.log(valid);
console.log(total);