const fs = require('fs');
const lines = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]{2}/g);

const numbers = lines[0].split(',').map((v) => parseInt(v));
const boards = [];

for (let i = 2; i < lines.length - 4; i += 6) {
  boards.push(
    lines
      .slice(i, i + 5)
      .join(' ')
      .split(/\s+/g)
      .map((v) => parseInt(v))
  );
}

function isWinner(mark) {
  for (let i = 0; i < 5; i++) {
    if (
      mark.filter((_, ii) => ii % 5 === i).every((v) => v) ||
      mark.filter((_, ii) => ii >= i * 5 && ii < i * 5 + 5).every((v) => v)
    ) {
      return true;
    }
  }

  return false;
}

function sumUnmarked(board, mark) {
  return mark.reduce((acc, cur, i) => (cur ? acc : acc + board[i]), 0);
}

function runV1(boardsV1) {
  const marks = boardsV1.map((b) => Array.from(b, () => false));
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < boardsV1.length; j++) {
      const foundIndex = boardsV1[j].findIndex((n) => n === numbers[i]);
      marks[j][foundIndex] = true;

      if (isWinner(marks[j])) {
        return sumUnmarked(boardsV1[j], marks[j]) * numbers[i];
      }
    }
  }
}

const resV1 = runV1([...boards]);
console.log('Part 1', resV1);

function runV2(boardsV2) {
  const marks = boardsV2.map((b) => Array.from(b, () => false));
  for (let i = 0; i < numbers.length; i++) {
    const winners = [];
    for (let j = 0; j < boardsV2.length; j++) {
      const foundIndex = boardsV2[j].findIndex((n) => n === numbers[i]);
      marks[j][foundIndex] = true;
      if (isWinner(marks[j])) {
        winners.push(j);
      }
    }

    if (winners.length === boardsV2.length) {
      return sumUnmarked(boardsV2[0], marks[0]) * numbers[i];
    }

    winners.reverse().forEach((i) => {
      boardsV2.splice(i, 1);
      marks.splice(i, 1);
    });
  }
}

const resV2 = runV2([...boards]);
console.log('Part 2', resV2);
