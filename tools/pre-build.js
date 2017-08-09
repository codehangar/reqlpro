#!/usr/bin/env node

const webpack = require('webpack');
const fse = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;
const webpackConfig = require('../webpack.production.config.js');
const DIR = require('./build-paths');

// Clear build and dist directories
console.log('1. Remove previous build and dist folders');
fse.emptyDirSync(DIR.BUILDS);
fse.emptyDirSync(DIR.DIST);
fse.emptyDirSync(DIR.APPS);

// Run webpack to make sure the newest code is compiled
console.log('2. Webpack compile code before packaging');
webpack(webpackConfig, (err, stats) => {
    if (err) {
        throw new Error('webpack:build', err);
    }
    console.log('[webpack:build]', stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true
    }));

    // Copy over package.build.json and rename it package.json
    console.log('3. Copy package.build.json to build folder renamed to package.json');
    fse.copySync(path.join(DIR.BASE, 'package.build.json'), path.join(DIR.BUILDS, 'package.json'));

    // Copy over non-webpack files
    console.log('4. Copy non-webpack files to root of build folder');
    fse.copySync('./shell/', DIR.BUILDS + '/shell/');

    // Copy over dist folder
    console.log('5. Copy dist folder to root of build folder');
    fse.copySync(DIR.DIST, DIR.BUILDS + '/dist/');

    console.log('6. Change working directory to build folder and Npm install production dependencies');
    const child = spawn('npm', ['i', '--production'], { cwd: DIR.BUILDS, shell: true });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
});

