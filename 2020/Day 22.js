const fs = require('fs');

const data = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]{4}/);
const players = data.map(tileData => {
  const lines = tileData.split(/[\r\n]+/);
  const m = lines[0].match(/Player (\d+):/);
  const deck = lines.slice(1).map(l => l.match(/^\d+$/)).filter(m => m).map(m => parseInt(m[0]));
  return {
    player: parseInt(m[1]),
    deck
  };
});

function playCombat(p1, p2) {
  if (!p2.length) return { winner: 1, deck: p1 };
  if (!p1.length) return { winner: 2, deck: p2 };
  return p1[0] > p2[0] ?
    playCombat([...p1.slice(1), p1[0], p2[0]], p2.slice(1)) :
    playCombat(p1.slice(1), [...p2.slice(1), p2[0], p1[0]]);
}

function calculateScore(deck) {
  return deck.reverse().reduce((acc, cur, idx) => acc + cur * (idx + 1), 0);
}

const combatWinner = playCombat(players[0].deck, players[1].deck);
const combatScore = calculateScore(combatWinner.deck);
console.log('Part 1', combatScore);

function hash(p1,p2) {
  return `${p1.join(',')}|${p2.join(',')}`;
}

function playRecursiveCombat(p1, p2) {
  const historic = [];
  while (p1.length && p2.length)
  {
    const h = hash(p1,p2);
    if (historic.includes(h)) return { winner: 1, deck: p1, stalling: true };
    const p1Card = p1[0], p2Card = p2[0];
    let roundWinner = p1Card > p2Card ? 1 : 2;
    if (p1Card < p1.length && p2Card < p2.length) {
      roundWinner = playRecursiveCombat(p1.slice(1, p1Card + 1),p2.slice(1, p2Card + 1)).winner;
    }
    
    p1.splice(0, 1);
    p2.splice(0, 1);
    if (roundWinner === 1) {
      p1.push(p1Card, p2Card);
    } else {
      p2.push(p2Card, p1Card);
    }

    historic.push(h);
  }

  if (!p2.length) return { winner: 1, deck: p1 };
  if (!p1.length) return { winner: 2, deck: p2 };
}

const recCombatWinner = playRecursiveCombat(players[0].deck, players[1].deck);
const recCombatScore = calculateScore(recCombatWinner.deck);
console.log('Part 2', recCombatScore);