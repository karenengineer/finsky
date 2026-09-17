const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const languages = ['ru', 'en', 'hy'];
const pages = ['home', 'services', 'about', 'privacy', 'contacts'];
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const placeholders = value => [...value.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map(match => match[1]).sort();

function checkShape(reference, value, location, translations = false) {
  assert.equal(Array.isArray(value), Array.isArray(reference), `${location}: array type differs`);
  assert.equal(typeof value, typeof reference, `${location}: type differs`);
  assert.notEqual(value, null, `${location}: null is not supported`);
  if (Array.isArray(reference)) {
    if (reference.length) value.forEach((item, index) => checkShape(reference[0], item, `${location}[${index}]`, translations));
    if (reference[0]?.id) {
      assert.deepEqual(value.map(item => item.id).sort(), reference.map(item => item.id).sort(), `${location}: IDs differ between languages`);
    }
  } else if (typeof reference === 'object') {
    assert.deepEqual(Object.keys(value).sort(), Object.keys(reference).sort(), `${location}: missing or extra keys`);
    for (const key of Object.keys(reference)) checkShape(reference[key], value[key], `${location}.${key}`, translations);
  } else if (translations) {
    assert.equal(typeof value, 'string', `${location}: translation must be a string`);
    assert.deepEqual(placeholders(value), placeholders(reference), `${location}: interpolation parameters differ`);
  }
}

function validateContent(root) {
  const assets = path.join(root, 'src/assets');
  const dictionaries = languages.map(language => read(path.join(assets, `i18n/${language}.json`)));
  dictionaries.forEach((dictionary, index) => checkShape(dictionaries[0], dictionary, `i18n/${languages[index]}`, true));
  const reference = Object.fromEntries(pages.map(page => [page, read(path.join(assets, `content/ru/${page}.json`))]));
  for (const language of languages) {
    assert.deepEqual(fs.readdirSync(path.join(assets, `content/${language}`)).filter(file => file.endsWith('.json')).sort(), pages.map(page => `${page}.json`).sort(), `${language}: page files differ`);
    const content = Object.fromEntries(pages.map(page => [page, read(path.join(assets, `content/${language}/${page}.json`))]));
    for (const page of pages) checkShape(reference[page], content[page], `${language}/${page}`);
    for (const [name, items] of Object.entries({ services: content.services, faq: content.home.faq, benefits: content.home.benefits, workSteps: content.home.workSteps, testimonials: content.home.testimonials, statistics: content.home.statistics })) {
      assert.equal(new Set(items.map(item => item.id)).size, items.length, `${language}/${name}: duplicate ID`);
      items.forEach(item => assert.ok(Number.isInteger(item.order) && item.order >= 0, `${language}/${name}/${item.id}: invalid order`));
    }
    const services = content.services;
    assert.deepEqual(services.map(service => [service.id, service.slug]).sort(), reference.services.map(service => [service.id, service.slug]).sort(), `${language}: service slugs differ between languages`);
    assert.equal(new Set(services.map(service => service.slug)).size, services.length, `${language}: duplicate service slug`);
    services.forEach(service => assert.match(service.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${language}: invalid service slug`));
    const home = content.home;
    for (const [url, alt] of [[home.hero.imageUrl, home.hero.imageAlt], [home.about.imageUrl, home.about.imageAlt], [home.team.backgroundImageUrl, home.team.backgroundImageAlt]]) {
      assert.ok(typeof url === 'string' && url.startsWith('assets/images/') && !url.includes('..'), `${language}: image must be local`);
      assert.ok(fs.existsSync(path.join(root, 'src', url)), `${language}: missing image ${url}`);
      assert.ok(typeof alt === 'string' && alt.trim(), `${language}: missing image alt text`);
    }
    assert.equal(typeof home.team.isVisible, 'boolean', `${language}: invalid team visibility`);
    assert.ok(Number.isFinite(home.team.overlayOpacity) && home.team.overlayOpacity >= 0 && home.team.overlayOpacity <= 1, `${language}: overlayOpacity must be between 0 and 1`);
    for (const seo of [home.seo, content.about.seo, content.privacy.seo, content.contacts.seo, ...services.map(service => service.seo)]) {
      assert.ok(seo && typeof seo.title === 'string' && seo.title.trim() && typeof seo.description === 'string' && seo.description.trim(), `${language}: missing SEO title/description`);
    }
  }
  // Check literal translation references; dynamic language keys are checked by shape parity.
  function inspect(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) inspect(file);
      else if (/\.(ts|html)$/.test(file) && !file.endsWith('.spec.ts')) {
        const source = fs.readFileSync(file, 'utf8');
        const matches = [...source.matchAll(/['"]([\w.]+)['"]\s*\|\s*translate/g), ...source.matchAll(/\.translate\(['"]([\w.]+)['"]/g)];
        for (const [, key] of matches) assert.equal(typeof key.split('.').reduce((value, part) => value?.[part], dictionaries[0]), 'string', `${file}: missing translation ${key}`);
      }
    }
  }
  inspect(path.join(root, 'src/app'));
}

module.exports = { checkShape, validateContent };
if (require.main === module) {
  try {
    validateContent(path.resolve(__dirname, '..'));
    console.log('HY/EN/RU: translation keys, content structure, IDs, slugs, SEO and local images are valid.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
