const fs = require('fs');
const path = require('path');

const manifestDir = path.join(__dirname, '..', '.next', 'server', 'app');

// Check if .next directory exists
if (!fs.existsSync(manifestDir)) {
  console.log('No .next/server/app directory found - skipping manifest check');
  process.exit(0);
}

const files = fs.readdirSync(manifestDir, { recursive: true });

let created = 0;
for (const file of files) {
  if (file.endsWith('_client-reference-manifest.js')) continue;
  
  const fullPath = path.join(manifestDir, file);
  if (fs.statSync(fullPath).isDirectory()) continue;
  if (!file.endsWith('.js')) continue;
  
  // If this is a page.js or route.js, ensure the manifest file exists
  const manifestPath = fullPath.replace(/\.js$/, '_client-reference-manifest.js');
  if (!fs.existsSync(manifestPath)) {
    fs.writeFileSync(manifestPath, 'module.exports = {};');
    created++;
  }
}

console.log(`✓ Created ${created} missing manifest files`);
