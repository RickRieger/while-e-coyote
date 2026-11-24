// Tests added during the 2026 cleanup (the assignment had no tests).
// Each test runs a script like `node sum-args.js 1 2 3` and checks what it prints.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(script, args = []) {
  const result = spawnSync(process.execPath, [path.join(__dirname, script), ...args], { encoding: 'utf8' });
  return { out: result.stdout.trim(), code: result.status };
}

describe('sum-args.js', () => {
  // the examples from the README
  it('prints 0 with no numbers', () => expect(run('sum-args.js').out).toBe('0'));
  it('adds 1 2 3', () => expect(run('sum-args.js', ['1', '2', '3']).out).toBe('6'));
  it('adds negatives too', () => expect(run('sum-args.js', ['-20', '30', '1', '2', '9']).out).toBe('22'));

  it('works for many arguments', () => {
    const nums = Array.from({ length: 50 }, (_, k) => String(k + 1));
    expect(run('sum-args.js', nums).out).toBe('1275');
  });

  it('adds decimals', () => expect(run('sum-args.js', ['1.5', '2.5']).out).toBe('4'));

  it('explains a non-number instead of printing NaN', () => {
    const { out, code } = run('sum-args.js', ['1', 'abc', '3']);
    expect(out).toMatch(/"abc" is not a number/);
    expect(code).toBe(1);
  });

  it('treats an empty argument as a non-number', () => {
    expect(run('sum-args.js', ['1', '', '3']).out).toMatch(/"" is not a number/);
  });
});

describe('pin-code.js', () => {
  // the examples from the README
  it('correct on the first guess', () =>
    expect(run('pin-code.js', ['1234']).out).toBe('That is correct. You took 1 guess(es).'));
  it('correct on the third guess', () =>
    expect(run('pin-code.js', ['0030', '1112', '1234']).out).toBe('That is correct. You took 3 guess(es).'));
  it('stops at the first correct pin', () =>
    expect(run('pin-code.js', ['1234', '0030', '1112']).out).toBe('That is correct. You took 1 guess(es).'));
  it('none correct', () =>
    expect(run('pin-code.js', ['0000', '1112']).out).toBe('None of the entered pin codes are correct.'));

  it('compares pins as text, so 01234 and 1234.0 are wrong', () =>
    expect(run('pin-code.js', ['01234', '1234.0', '1234']).out).toBe('That is correct. You took 3 guess(es).'));

  it('says so when no pin codes are entered', () =>
    expect(run('pin-code.js').out).toBe('No pin codes were entered. Try: node pin-code.js 0030 1234'));
});

describe('the restrictions', () => {
  for (const script of ['sum-args.js', 'pin-code.js']) {
    const code = fs.readFileSync(path.join(__dirname, script), 'utf8').replace(/\/\/.*$/gm, '');
    it(`${script} uses a while loop`, () => expect(code).toMatch(/\bwhile\s*\(/));
    it(`${script} does not count the arguments with process.argv`, () => expect(code).not.toMatch(/process\.argv/));
  }
});
