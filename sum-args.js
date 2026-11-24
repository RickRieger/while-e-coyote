const getInput = require('./get-input.js');

// Your code here!

// Add up every number typed after `node sum-args.js`.
// getInput(n) returns undefined once we run past the last argument,
// so that is the loop's stopping point (no process.argv.length needed).
let total = 0;
let n = 1;
let arg = getInput(n);

while (arg !== undefined) {
  const num = Number(arg);
  if (arg.trim() === '' || Number.isNaN(num)) {
    console.log(`"${arg}" is not a number. Please enter numbers only, like: node sum-args.js 1 2 3`);
    process.exit(1);
  }
  total += num;
  n++;
  arg = getInput(n);
}

console.log(total);
