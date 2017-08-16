#!/usr/bin/env node

const DIR = require('./build-paths');
const fse = require('fs-extra');
const packageConfig = require(DIR.PACKAGE_JSON);
const packageBuildConfig = require(DIR.PACKAGE_BUILD_JSON);
const exec = require('child_process').exec;

const updated = Object.assign({}, packageBuildConfig, { version: packageConfig.version });

fse.writeJsonSync(DIR.PACKAGE_BUILD_JSON, updated, { spaces: 2 });
