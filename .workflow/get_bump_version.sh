#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const currentDirProcess = process.cwd();
const packagePath = path.resolve(currentDirProcess, 'package.json');
const pack = JSON.parse(fs.readFileSync(packagePath).toString());

const releaseBump = {};
releaseBump.major = function _major(major, minor, patch) { return [Number(major) + 1, 0, 0].join('.') };
releaseBump.minor = function _minor(major, minor, patch) { return [major, Number(minor) + 1, 0].join('.') };
releaseBump.patch = function _patch(major, minor, patch) { return [major, minor, Number(patch) + 1].join('.'); };

function bump(releaseType) {
  const [major, minor, patch] = pack.version.split('.');
  const release = releaseBump[releaseType];
  const newVersion = release(major, minor, patch);
  process.stdout.write(newVersion);
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
  const releaseType = data.join('').trim() || 'no_release';
  bump(releaseType);
});
