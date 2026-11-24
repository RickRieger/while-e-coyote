# While-E-Coyote

[![Tests](https://github.com/RickRieger/while-e-coyote/actions/workflows/tests.yml/badge.svg)](https://github.com/RickRieger/while-e-coyote/actions/workflows/tests.yml)

**No live site.** These are command-line Node scripts, not a web page. The badge above shows the latest test run on GitHub Actions; click it to see the results.

This exercise is from the **Code Immersives** bootcamp in New York City (**March 2021**). I forked it from the instructor's repo, but my fork only ever held the starter files: `sum-args.js` and `pin-code.js` just said `// Your code here!`. I most likely worked on it locally and never pushed it. **The solution here was written during the 2026 cleanup**, not in 2021. The instructor's original instructions are kept unchanged under [Original assignment](#original-assignment-from-the-instructor) below.

## What it practices

The twist in this assignment is the restriction: **you can't ask how many arguments there are** (`process.argv.length` is off limits). So a `for` loop that counts to a known number won't work. A `while` loop fits, because it keeps going until a condition changes, and you don't need to know ahead of time how many times that will be.

The helper `getInput(n)` returns the nth thing typed after `node <file>`. Past the last one it returns `undefined`, and that is the signal to stop:

```js
let n = 1;
let arg = getInput(n);
while (arg !== undefined) {
  // ...use arg...
  n++;
  arg = getInput(n);   // read the next one; undefined means we're done
}
```

## My solution

### Part 1: [`sum-args.js`](sum-args.js)

Adds every argument to a running `total`, then prints it. Arguments arrive as text, so each one goes through `Number()`. If one isn't a number, the script says which one and stops (exit code 1) instead of printing `NaN`.

```bash
node sum-args.js -20 30 1 2 9    # 22
node sum-args.js 1 abc 3         # "abc" is not a number. Please enter numbers only, ...
```

### Part 2: [`pin-code.js`](pin-code.js)

Checks one pin at a time and stops at the first correct one, so later pins are never read. The loop has two ways to end: it runs out of pins (`pin === undefined`) or it finds the right one (`found`). Pins stay as **text**, so `01234` and `1234.0` don't match `'1234'`, the way a real keypad works.

```bash
node pin-code.js 0030 1112 1234  # That is correct. You took 3 guess(es).
node pin-code.js 0000 1112       # None of the entered pin codes are correct.
node pin-code.js                 # No pin codes were entered. Try: node pin-code.js 0030 1234
```

## Run the tests

```bash
npm ci
npm run test:ci   # runs once and exits (expected: Tests: 17 passed, 17 total)
```

## How it's checked

The assignment had no tests, so I added [`main.test.js`](main.test.js). It runs each script the way you would in a terminal and checks what it prints. It covers every example from the instructions, plus 50 arguments, decimals, non-numbers, no input, and pins that only look like `1234`. It also checks the restrictions: each script uses a `while` loop and never touches `process.argv`. **GitHub Actions** ([`.github/workflows/tests.yml`](.github/workflows/tests.yml)) runs the tests on Node 20 on every push and pull request. On the starter files, 15 of the 17 tests fail. The two that pass are the "no `process.argv`" checks, since empty files don't use it.

## Cleanup log

### 2026-11-24

**1. Wrote Part 1, `sum-args.js`**

*Why:* the fork had only the starter file.

Before:

```js
const getInput = require('./get-input.js');

// Your code here!
```

After:

```js
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
```

The `arg.trim() === ''` check is there because `Number('')` is `0`, not `NaN`. Without it, an empty argument (`node sum-args.js 1 "" 3`) would quietly count as zero.

**2. Wrote Part 2, `pin-code.js`**

*Why:* the fork had only the starter file (same as above).

After:

```js
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
```

The instructions don't say what to do with no pins at all. "None of the entered pin codes are correct" would be technically true but misleading, so the script says nothing was entered.

**3. Added tests and GitHub Actions**

*Why:* so both scripts are checked automatically, including the restrictions. This adds `package.json` (Jest 29 with a one-shot `test:ci` script), `main.test.js`, and the workflow behind the badge at the top. `.gitignore` already ignored `node_modules`.

**4. This README**

*Why:* to explain the solution and be clear that it was written in 2026. The instructor's text below is unchanged.

---

## Original assignment (from the instructor)

# `while-e-coyote`

> An assignment with `while` loops. This assignment has two parts.

## Restrictions

* **You must use a while loop**
* **Do not use process.argv.length or any other means of trivially getting the number of command line arguments passed to the program**

## Part 1: `sum-args.js`

In the `sum-args.js` file, write code such that any numbers that are given to the program as arguments are added together, then console.logged.

**Examples:**

```
node sum-args.js
> 0

node sum-args.js 1 2 3
> 6

node sum-args.js -20 30 1 2 9
> 22
```

This program should work for any number of arguments!

Hints:
* Use the `getInput` function
* Use a while loop
* You will not need to define any functions (you can if you want though)

## Part 2: `pin-code.js`

In the `pin-code.js` file, a user should be able to input any number of pin codes via command line arguments. The program reads each pin code one by one.
If the pin code is equal to the correct pin code (let's use `'1234'`), the program tells the user they got the pin code correct as well as how many guesses it took.
If the none of the pin codes are correct, the program tells the user that all the pin codes were incorrect.

**Examples:**

```
node pin-code.js 1234
> That is correct. You took 1 guess(es).

node pin-code.js 0030 1112 1234
> That is correct. You took 3 guess(es).

node pin-code.js 1234 0030 1112
> That is correct. You took 1 guess(es).

node pin-code.js 0000 1112
> None of the entered pin codes are correct.
```

Just like the previous challenge, this code should work for any number of arguments.

Hints:
* Use the `getInput` function
* Use a while loop
* You will not need to define any functions (you can if you want though)
* If a user enters the pin code correctly, we're done and do not process any subsequent pin codes


