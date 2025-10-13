#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const versionPath = path.join(__dirname, '..', 'version.json');

// Read current version
const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf-8'));

// Increment build number
const newBuild = (parseInt(versionData.build) + 1).toString();

// Get git commit hash
let commit = 'unknown';
try {
  commit = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
} catch (e) {
  console.warn('Could not get git commit hash');
}

// Update version data
const newVersionData = {
  ...versionData,
  build: newBuild,
  buildDate: new Date().toISOString().split('T')[0],
  commit,
};

// Write back to file
fs.writeFileSync(versionPath, JSON.stringify(newVersionData, null, 2) + '\n');

console.log(`✓ Build incremented: ${versionData.build} → ${newBuild}`);
console.log(`✓ Commit: ${commit}`);
console.log(`✓ Date: ${newVersionData.buildDate}`);
