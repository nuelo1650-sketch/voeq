const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '.next', 'server');
let missing = 0;
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.nft.json')) {
      try {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        const base = path.dirname(p);
        for (const rel of (data.files || [])) {
          if (!rel.includes('page_client-reference-manifest.js')) continue;
          const target = path.normpath(path.join(base, rel));
          if (!fs.existsSync(target)) {
            fs.mkdirSync(path.dirname(target), { recursive: true });
            fs.writeFileSync(target, 'module.exports = { files: [] };\n');
            missing++;
          }
        }
      } catch {}
    }
  }
}
walk(root);
if (missing) console.log(`fixed ${missing} missing client-reference manifest(s)`);
