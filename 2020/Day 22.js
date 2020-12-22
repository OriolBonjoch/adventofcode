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

const cache = {
  '17,50,14,45,5,42,18,33,7,48,21,39,4,36,1,35,24,32,3,40,9,38,23,27,2,34|43,25,31,8,44,10,41,22,49,12,47,19,46,20,30': 1,
  '43,25,31,8,44,10,41,22,49,12,47,19,46,20,30|17,50,14,45,5,42,18,33,7,48,21,39,4,36,1,35,24,32,3,40,9,38,23,27,2,34': 1,
  '17,3,50,45,42,26,48,39,22,5,47,7,40,38,35,10,41,27,34,18,25,21,23,13,43,33,4,1,36|44,9,24,2,15,8,30,12,19,14,49,32,20,6,46,31': 1,
  '44,9,24,2,15,8,30,12,19,14,49,32,20,6,46,31|17,3,50,45,42,26,48,39,22,5,47,7,40,38,35,10,41,27,34,18,25,21,23,13,43,33,4,1,36': 1
};
function playRecursiveCombat(p1, p2, historic = [], gameId = 0) {
  // if (historic.length % 10 === 0 && gameId === 0) console.log(`round #${historic.length} (${Object.keys(cache).length} cached)`);
  const h = hash(p1,p2);
  if (!p2.length) return { winner: 1, deck: p1 };
  if (!p1.length) return { winner: 2, deck: p2 };
  if (historic.includes(h)) return { winner: 1, deck: p1, stalling: true };
  if (p1[0] < p1.length && p2[0] < p2.length) {
    const subGameHash = hash(p1.slice(1, p1[0]+1), p2.slice(1, p2[0]+1));
    let subGameWinner = cache[subGameHash];
    if (!subGameWinner) {
      const subgame = playRecursiveCombat(p1.slice(1, p1[0]+1),p2.slice(1, p2[0]+1), [], gameId + 1);
      subGameWinner = subgame.winner;
      cache[subGameHash] = subgame.winner;
      cache[subGameHash.split('|').reverse().join('|')] = subgame.winner === 2 || subgame.stalling ? 1 : 2;
    }
    
    return subGameWinner === 1 ?
      playRecursiveCombat([...p1.slice(1), p1[0], p2[0]], p2.slice(1), [...historic, h], gameId) :
      playRecursiveCombat(p1.slice(1), [...p2.slice(1), p2[0], p1[0]], [...historic, h], gameId);
  }

  return p1[0] > p2[0] ?
    playRecursiveCombat([...p1.slice(1), p1[0], p2[0]], p2.slice(1), [...historic, h], gameId) :
    playRecursiveCombat(p1.slice(1), [...p2.slice(1), p2[0], p1[0]], [...historic, h], gameId);
}

const recCombatWinner = playRecursiveCombat(players[0].deck, players[1].deck);
const recCombatScore = calculateScore(recCombatWinner.deck);
console.log('Part 2', recCombatScore);