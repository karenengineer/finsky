const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildMessage } = require('./notify-telegram.cjs');

const details = {
  status: 'success',
  commit: 'a'.repeat(40),
  runUrl: 'https://github.com/karenengineer/finsky/actions/runs/123',
};

test('reports the deployment result and run without including credentials', () => {
  const message = buildMessage(details);
  assert.match(message, /FinSky production/);
  assert.match(message, /success/);
  assert.match(message, /aaaaaaa/);
  assert.match(message, /https:\/\/github\.com\/karenengineer\/finsky\/actions\/runs\/123/);
  assert.doesNotMatch(message, /bot token|chat id/i);
});

test('rejects unknown status or untrusted run URL', () => {
  assert.throws(() => buildMessage({ ...details, status: 'maybe' }));
  assert.throws(() => buildMessage({ ...details, runUrl: 'https://example.com/run' }));
});
