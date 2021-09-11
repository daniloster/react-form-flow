#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const currentDirProcess = process.cwd();
const packagePath = path.resolve(currentDirProcess, 'package.json');
const pack = JSON.parse(fs.readFileSync(packagePath).toString());

function bump(version) {
  pack.version = version.trim();
  const packageContent = JSON.stringify(pack, null, 2);
  fs.writeFileSync('package.json', packageContent + '\n', 'utf8');
}

const data = [];
process.stdin.setEncoding('utf8');
process.stdin.on('readable', function() {
  const value = process.stdin.read();
  if (value) {
    data.push(value);
  }
});

process.stdin.on('end', function() {
  const releaseType = data.join('').trim() || pack.version;
  bump(releaseType);
});
