const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const { JSDOM } = require('jsdom');

const { name } = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const distPath = path.join(__dirname, 'dist');
const packagePath = path.join(__dirname, '.package');
const blocklet = yaml.load(fs.readFileSync(path.join(__dirname, 'blocklet.yml'), 'utf8'));

// prepare dist
if (fs.existsSync(packagePath)) {
  fs.rmSync(packagePath, { recursive: true });
}
fs.mkdirSync(packagePath);
fs.copySync(distPath, packagePath);
fs.removeSync(path.join(packagePath, 'vite.svg'));

const indexFile = path.join(packagePath, 'index.html');
const source = fs.readFileSync(indexFile, 'utf8');
const dom = new JSDOM(source);
dom.window.document.querySelector('script')?.remove(); // remove blocklet.js
const scriptTag = dom.window.document.querySelector('script');
if (scriptTag) {
  scriptTag.src = scriptTag.src.replace(`/.blocklet/proxy/${blocklet.did}`, '.');
}
const styleTag = dom.window.document.querySelector('link[rel="stylesheet"]');
if (styleTag) {
  styleTag.href = styleTag.href.replace(`/.blocklet/proxy/${blocklet.did}`, '.');
}
const favIco = dom.window.document.querySelector('link[rel="icon"]');
if (favIco) {
  favIco.href = `/${favIco.href}`;
}

fs.writeFileSync(indexFile, dom.serialize());
console.log('html entry generated');

// prepare package.json
fs.writeFileSync(
  path.join(packagePath, 'package.json'),
  JSON.stringify(
    {
      name,
      version: blocklet.version,
      main: 'index.js',
      publishConfig: {
        access: 'public',
      },
    },
    null,
    2
  )
);
console.log('npm package.json generated');

fs.writeFileSync(
  path.join(packagePath, 'index.js'),
  'module.exports = {};'
);
console.log('npm index.js generated');
