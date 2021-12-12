const fs = require('fs');
const data = fs
  .readFileSync('data.txt', 'utf8')
  .split(/[\r\n]{2}/g)
  .map((l) => l.split('-'));

const graphMap = data.reduce(
  (acc, [a, b]) => ({
    ...acc,
    [a]: acc[a] ? [...acc[a], b] : [b],
    [b]: acc[b] ? [...acc[b], a] : [a],
  }),
  {}
);

function findPaths(graph, filter, next, visited) {
  if (next === 'start') return [];
  if (next === 'end') return [visited];

  if (filter(visited, next)) return [];
  return [
    ...graph[next].flatMap((p) => {
      return findPaths(graph, filter, p, `${visited}-${next}`);
    }),
  ];
}

const checkP1 = (v, n) => /^[a-z]+$/.test(n) && v.indexOf(n) !== -1;
const resP1 = graphMap['start'].flatMap((m) =>
  findPaths(graphMap, checkP1, m, '')
);

console.log('Part 1', resP1.length);

const checkP2 = (v, n) =>
  /^[a-z]+$/.test(n) &&
  /^.*(?:((\-|\b)[a-z]+(\-|\b)).*\1).*$/.test(v) &&
  v.indexOf(n) !== -1;
const resP2 = graphMap['start'].flatMap((m) =>
  findPaths(graphMap, checkP2, m, '')
);
console.log('Part 2', resP2.length);
