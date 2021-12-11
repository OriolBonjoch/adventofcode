const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scores.txt', 'utf8'));

const members = Object.values(data.members).map((m) => ({
  name: m.name,
  id: m.id,
  score: m.local_score,
  position: Object.keys(m.completion_day_level).reduce(
    (acc, day) => ({
      ...acc,
      [day * 2 - 2]:
        (m.completion_day_level[day] &&
          m.completion_day_level[day][1]?.get_star_ts) ||
        null,
      [day * 2 - 1]:
        (m.completion_day_level[day] &&
          m.completion_day_level[day][2]?.get_star_ts) ||
        null,
    }),
    []
  ),
}));

const resultPerDay = [...Array(50).keys()]
  .map((n) =>
    members
      .map((m) => ({ name: m.name, time: m.position[`${n}`] }))
      .filter((m) => m.time)
      .sort((a, b) => a.time - b.time)
      .map((m, i) => ({ ...m, points: members.length - i }))
  )
  .map((cur) => cur.reduce((a, c) => ({ ...a, [c.name]: c.points }), {}));

const result = members
  .map((m) => ({
    name: m.name,
    points: resultPerDay.reduce((a, c) => (c[m.name] ? a + c[m.name] : a), 0),
  }))
  .sort((a, b) => a.points - b.points);

console.log(result);
