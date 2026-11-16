import assert from 'node:assert/strict';
import { isAccessLabUnlocked, verifyBetaCode, lockAccessLab, VALID_BETA_CODE } from '../src/utils/betaAuth';

// Mock localStorage and sessionStorage for node environment
const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

(globalThis as any).localStorage = storageMock;
(globalThis as any).sessionStorage = storageMock;

// 1. Initially locked
lockAccessLab();
assert.equal(isAccessLabUnlocked(), false, 'Access control lab should initially be locked');

// 2. Reject incorrect code
assert.equal(verifyBetaCode('WRONG'), false, 'Wrong code should be rejected');
assert.equal(verifyBetaCode('12345'), false, 'Wrong numeric code should be rejected');
assert.equal(verifyBetaCode(''), false, 'Empty code should be rejected');
assert.equal(isAccessLabUnlocked(), false, 'Lab should remain locked after invalid codes');

// 3. Accept valid code 'DELMI' (case insensitive, trimmed)
assert.equal(VALID_BETA_CODE, 'DELMI');
assert.equal(verifyBetaCode('DELMI'), true, 'Exact DELMI should unlock');
assert.equal(isAccessLabUnlocked(), true, 'Lab should be unlocked');

// 4. Lock again
lockAccessLab();
assert.equal(isAccessLabUnlocked(), false, 'Lock should re-lock the lab');

// 5. Accept 'delmi' lowercase and with whitespace
assert.equal(verifyBetaCode('  delmi  '), true, 'Trimmed lowercase delmi should unlock');
assert.equal(isAccessLabUnlocked(), true, 'Lab should be unlocked');

console.log('PASS: betaAuth verification, locking, unlocking, and case insensitivity.');
