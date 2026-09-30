const { test } = require('node:test');
const assert = require('node:assert/strict');
const { checkShape, validateContent } = require('./check-content.cjs');
const path = require('node:path');
const fs = require('node:fs');

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

test('published content uses confirmed contacts and no unverified numbers', () => {
  for (const language of ['ru', 'en', 'hy']) {
    const assets = path.resolve(__dirname, `../src/assets`);
    const contacts = JSON.parse(fs.readFileSync(path.join(assets, `content/${language}/contacts.json`), 'utf8'));
    const home = JSON.parse(fs.readFileSync(path.join(assets, `content/${language}/home.json`), 'utf8'));
    const dictionary = JSON.parse(fs.readFileSync(path.join(assets, `i18n/${language}.json`), 'utf8'));
    const privacy = fs.readFileSync(path.join(assets, `content/${language}/privacy.json`), 'utf8');

    assert.equal(contacts.phone, '+374 41 109 109');
    assert.equal(contacts.email, 'info@finsky.am');
    assert.equal(dictionary.common.contact.phone, contacts.phone);
    assert.equal(dictionary.common.contact.email, contacts.email);
    assert.ok(home.statistics.every(statistic => !/\[N\]|100%/.test(statistic.value)));
    assert.ok(home.testimonials.every(testimonial => testimonial.isDemo));
    assert.doesNotMatch(JSON.stringify(home.testimonials), /клиент с 2021 года/);
    assert.doesNotMatch(JSON.stringify(dictionary.home.testimonial), /клиент с 2021 года|Алексей Миронов/);
    assert.doesNotMatch(privacy, /privacy@finsky\.am/);
    assert.doesNotMatch(JSON.stringify(dictionary), /privacy@finsky\.am/);
  }
});
