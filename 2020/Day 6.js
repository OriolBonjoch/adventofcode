const fs = require('fs');

const groups = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]{4}/g);

let sumAny = 0;
let sumAll = 0;
const ids = [];
groups.forEach(group => {
  const answers = [];
  const all = {};
  group.match(/[a-zA-Z]/g).forEach(m => {
    if (!answers.includes(m)) {
      answers.push(m);
    }
  });
  const persons = group.split(/\r\n/g);
  persons.forEach(p => {
    p.match(/[a-zA-Z]/g).forEach(m => {
      all[m] = all[m] ? all[m]+1 : 1;
    });
  });

  sumAll += Object.keys(all).filter(m => all[m] === persons.length).length;
  sumAny += answers.length;
});

console.log(sumAny);
console.log(sumAll);