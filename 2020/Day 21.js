const fs = require('fs');

const data = fs.readFileSync('data.txt', 'utf8').split(/[\r\n]+/);
const allFoods = data.map(line => {
  const m = line.match(/^([\w\s]+) \(contains ([\w\s,]+)\)$/);
  const ingredients = m[1].split(' ');
  const allergens = m[2].split(',').map(a => a.trim());
  return { ingredients, allergens }
});

function getAllergends(foods) {
  const allergens = {};
  foods.forEach(f => {
    f.allergens.forEach(al => {
      allergens[al] = allergens[al] ? allergens[al].filter(ing => f.ingredients.includes(ing)) : f.ingredients;
    });
  });

  while (!Object.values(allergens).every(possibles => possibles.length === 1))
  {
    Object.keys(allergens).forEach(al => {
      if (allergens[al].length === 1) return;
      allergens[al] = allergens[al].filter(ing => !Object.values(allergens)
        .filter(possible => possible.length === 1)
        .flatMap(ing => ing)
        .includes(ing));
    });    
  }

  return allergens;
}

const allergens = getAllergends(allFoods);
const ingredientsWithAllergens = Object.values(allergens).flatMap(i => i);
const count = allFoods.reduce((acc, cur) => acc + cur.ingredients.filter(i => !ingredientsWithAllergens.includes(i)).length, 0);
console.log(allergens);
console.log(Object.keys(allergens).sort());
console.log('Part 1', count);
console.log('Part 2', Object.keys(allergens).sort().map(a => allergens[a][0]).join(','));