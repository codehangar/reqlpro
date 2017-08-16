const path = require('path');

const BASE = path.join(__dirname, '..');
const BUILDS = path.join(BASE, 'builds');
const DIST = path.join(BASE, 'dist');
const APPS = path.join(BASE, 'apps');
const ICO_FILE = path.join(BASE, 'app/images/reql-icon.ico');
const ICNS_FILE = path.join(BASE, 'app/images/reqlpro.icns');
const PACKAGE_JSON = path.join(BASE, 'package.json');
const PACKAGE_BUILD_JSON = path.join(BASE, 'package.build.json');

module.exports = {
    BASE: BASE,
    BUILDS: BUILDS,
    DIST: DIST,
    APPS: APPS,
    ICO_FILE: ICO_FILE,
    ICNS_FILE: ICNS_FILE,
    PACKAGE_JSON: PACKAGE_JSON,
    PACKAGE_BUILD_JSON: PACKAGE_BUILD_JSON
};
