const fs = require('fs');
const data = fs
  .readFileSync('data.txt', 'utf8')
  .split(/[\r\n]{2}/g)
  .map((l) => parseInt(l.match(/\d+$/g)[0]));

function play(p1, p2, sides, top) {
  let pointsP1 = 0;
  let pointsP2 = 0;
  let i = 1;
  while (pointsP2 < top) {
    p1 = (p1 + (i++ % sides) + (i++ % sides) + (i++ % sides)) % 10 || 10;
    pointsP1 += p1;

    if (pointsP1 >= top) {
      break;
    }

    p2 = (p2 + (i++ % sides) + (i++ % sides) + (i++ % sides)) % 10 || 10;
    pointsP2 += p2;
  }

  return [pointsP1, pointsP2, i - 1];
}

const [player1, player2, rolls] = play(data[0], data[1], 100, 1000);
const resP1 = Math.min(player1, player2) * rolls;

console.log('Part 1', resP1);

function play2(p1, p2, pointsP1, pointsP2, player1Turn, top) {
  if (pointsP1 >= top || pointsP2 >= top) return pointsP1 > pointsP2 ? 1 : 0;
  return [1, 3, 6, 7, 6, 3, 1].reduce((acc, cur, idx) => {
    let newP1 = player1Turn ? (p1 + idx + 3) % 10 || 10 : p1;
    let newP2 = player1Turn ? p2 : (p2 + idx + 3) % 10 || 10;
    return (
      acc +
      cur *
        play2(
          newP1,
          newP2,
          player1Turn ? pointsP1 + newP1 : pointsP1,
          player1Turn ? pointsP2 : pointsP2 + newP2,
          !player1Turn,
          top
        )
    );
  }, 0);
}

const resP2 = {
  winsP1: play2(data[0], data[1], 0, 0, true, 21),
  winsP2: play2(data[1], data[0], 0, 0, false, 21),
};

console.log('Part 2', Math.max(resP2.winsP1, resP2.winsP2));
