const cardPublicKey = 12578151
const doorPublicKey = 5051300;

function encode(loop, value) {
  let subject = 1;
  while (loop--) subject = (value * subject) % 20201227;
  return subject;
}

function decode(value, target) {
  let subject = 1;
  let loop = 1;
  while (target !== subject && loop++ < 20201227) subject = (value * subject) % 20201227;
  return loop - 1;
}

let cardPrivateKey = decode(7, cardPublicKey);
let doorPrivateKey = decode(7, doorPublicKey);

let encryptionKey = encode(cardPrivateKey, doorPublicKey);

console.log('Part 1', encryptionKey);