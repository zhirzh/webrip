const { execSync } = require('child_process');
const { existsSync, mkdirSync } = require('fs');
const { resolve } = require('path');

const PUBLIC_DIR = resolve(__dirname, 'public');
const BUILD_DIR = resolve(__dirname, 'build');

if (!existsSync(BUILD_DIR)) {
  mkdirSync(BUILD_DIR);
} else {
  execSync(`rm -r ${BUILD_DIR}/*`);
}

execSync(`cp -r ${PUBLIC_DIR}/* ${BUILD_DIR}`);
