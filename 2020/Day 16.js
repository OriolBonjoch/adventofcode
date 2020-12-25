const fs = require('fs');
const data = fs.readFileSync('data.txt', 'utf8').split(/(\r?\n){2}/g).filter(x => !/^[\r\n\s]+$/.test(x));

const ruleReg = /(\d+-\d+)(?=$| or)/g;
const allRules = data[0].split(/\r?\n/).map(l => {
  const m = l.split(':');
  const name = m[0];
  const rules = [];
  while((r = ruleReg.exec(m[1])) !== null) {
    const limits = r[1].split('-').map(x => parseInt(x));
    rules.push({ min: limits[0], max: limits[1]});
  }

  return { name, rules };
});

const ranges = allRules.flatMap(x => x.rules).reduce((acc, cur) => [...acc, { ...cur}], []);
const myTicket = data[1].split(/\r?\n/).filter(line => /^((\d+),?)+$/.test(line))[0];
const nearbyTickets = data[2].split(/\r?\n/).filter(line => /^((\d+),?)+$/.test(line));

function validate(tickets) {
  return tickets.map((ticket, i) => {
    const numbers = ticket.match(/(\d+),?/g).map(x => parseInt(x));
    const misses = numbers.filter(num =>
      ranges.every(range => num < range.min || num > range.max));

    const possibles = numbers.map(num =>
      allRules
        .filter(rule => rule.rules.some(x => x.min <= num && num <= x.max))
        .map(rule => rule.name));

    return { ticket, misses, possibles };
  });
}

function joinPossibles(validation, init) {
  const validTickets = validation.filter(ticket => ticket.misses.length === 0);
  const { possibles } = init;
  validTickets.forEach(t => {
    t.possibles.forEach((currentPossibles, i) => {
      possibles[i] = possibles[i].filter(prop => currentPossibles.includes(prop));
    })
  });

  return possibles;
}

function reducePossibles(possibles) {
  const result = [...possibles];
  let i = 0;
  while(!result.every(p => p.length === 1) && i++ < result.length) {
    const sureProp = result.filter(p => p.length === 1).flatMap(x => x);
    result.forEach((_, i) => {
      result[i] = result[i].length > 1 ? result[i].filter(p => !sureProp.includes(p)) : result[i];
    });
  }
  return result;
}

const validation = validate(nearbyTickets);
const totalMisses = validation.filter(x => x.misses.length).flatMap(x => x.misses).reduce((acc, cur) => acc + cur, 0);
console.log('Part 1', totalMisses);

const allPossibles = joinPossibles(validation, validate([myTicket]).pop());
const possibles = reducePossibles(allPossibles);
const fields = possibles.flatMap(x => x);
const myTicketNums = myTicket.match(/(\d+),?/g).map(x => parseInt(x));
console.log('Part 2', myTicketNums.reduce((acc, cur, idx) => fields[idx].startsWith('departure') ? acc * cur : acc, 1));