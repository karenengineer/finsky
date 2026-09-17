const { test } = require('node:test');
const assert = require('node:assert/strict');
const { checkShape, validateContent } = require('./check-content.cjs');
const path = require('node:path');

test('rejects missing keys and incorrect field types', () => {
  assert.throws(() => checkShape({ title: 'Title' }, {}, 'page'));
  assert.throws(() => checkShape({ visible: true }, { visible: 'true' }, 'page'));
});
test('allows variable paragraph counts but rejects missing localized records', () => {
  checkShape(['One'], ['One', 'Two'], 'body');
  assert.throws(() => checkShape([{ id: 'a', title: 'A' }], [], 'services'));
});
test('rejects changed interpolation parameters', () => {
  assert.throws(() => checkShape('Hello {{name}}', 'Hello {{year}}', 'greeting', true));
});
test('validates the actual project content', () => {
  validateContent(path.resolve(__dirname, '..'));
});
