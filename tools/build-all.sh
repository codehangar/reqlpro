#!/usr/bin/env bash

# Clear build and dev directory
echo 'Remove previous build and dist folders'
rm -rf builds
rm -rf dist
rm -rf apps

# Run webpack to make sure the newest code is compiled
echo 'Webpack compile code before packaging'
webpack --config ./webpack.production.config.js --progress --profile --colors

# Make build and dist directory
echo 'Create new empty builds folder'
mkdir builds

# Copy over package.build.json and rename it package.json
echo 'Copy package.build.json to build folder renamed to package.json'
cp package.build.json ./builds/package.json

# Copy over non-webpack files
echo 'Copy non-webpack files to root of build folder'
cp main.js ./builds/main.js
cp menu.config.js ./builds/menu.config.js
cp main.electron-utils.js ./builds/main.electron-utils.js

# Copy over dist folder
echo 'Copy dist folder to root of build folder'
cp -R dist/ ./builds/dist/

# Change working directory to npm install
echo 'Change working directory to build folder'
cd builds

# Npm install production dependencies
npm install --production
echo 'npm install production dependencies'

# Build All packages
echo 'Build all app packages'
npm run package-mac
npm run package-windows
npm run package-linux

# Copy tools over to builds folder
echo 'Copy tools over to builds folder'
cp -R ../tools/ ./tools/

# Npm install builds/dev dependencies
echo 'npm install builds/dev dependencies'
npm install

# Build Mac OS DMG
echo 'Build DMG for Mac OSX app package'
npm run build-dmg

# Build ZIP archives for Windows and Linux
echo 'Build ZIP archives for Windows and Linux'
npm run build-zips

# Build Windows Installer
#echo 'Build windows installer for windows package'
#npm run build-windows-installer
