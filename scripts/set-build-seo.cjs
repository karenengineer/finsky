const fs = require('node:fs');
const { JSDOM, VirtualConsole } = require('jsdom');

// Populate the initial HTML from the same JSON used by the Angular home page.
const file = 'dist/finkeep/browser/index.html';
const { seo } = JSON.parse(fs.readFileSync('src/assets/content/ru/home.json', 'utf8'));
// This pass only parses HTML; jsdom's CSS engine is not needed for metadata.
const dom = new JSDOM(fs.readFileSync(file, 'utf8'), { virtualConsole: new VirtualConsole() });
dom.window.document.title = seo.title;
dom.window.document.querySelector('meta[name="description"]').setAttribute('content', seo.description);
fs.writeFileSync(file, dom.serialize());
console.log('Initial HTML SEO populated from content/ru/home.json.');
