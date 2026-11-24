const getInput = require('./get-input.js');

// Your code here!

// Check each pin code typed after `node pin-code.js`, one at a time,
// and stop at the first correct one.
// Pins stay strings, so '01234' is not the same as '1234'.
const correctPin = '1234';
let guesses = 0;
let found = false;
let pin = getInput(1);

while (pin !== undefined && !found) {
  guesses++;
  if (pin === correctPin) {
    found = true;
  } else {
    pin = getInput(guesses + 1);
  }
}

if (guesses === 0) {
  console.log('No pin codes were entered. Try: node pin-code.js 0030 1234');
} else if (found) {
  console.log(`That is correct. You took ${guesses} guess(es).`);
} else {
  console.log('None of the entered pin codes are correct.');
}
