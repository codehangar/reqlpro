# ReQLPro Contributor Guide

## Local Development Setup

Requires Nodejs. Check the "engine" field of the `package.json` for the version currently being built and testing 
with: i.e. `"engine": "node 6.10.3"`
- npm install
- npm start

## File Structure

The `app` directory has all the HTML, CSS, and Javascript essential to most of the application.

The `tools` directory is where scripts related to running (for local development), building, and packaging the 
application are held

The `shell` directory has all of the files dealing directly with electron setup and configuration.

### Generated Directories

The `dist` directory houses the generated and compiled webpack files

The `builds` directory receives:
- a copy of the above `dist` folder
- a copy of the `shell` folder
- a copy of the `tools` folder
- a of the `package.build.json`, renamed to `package.json`
- and executes an `npm install`

The `apps` directory receives:
- Electron builds for Mac, Windows, and Linux
- Packaged `.dmg` for Mac
- `.zip` bundles for Windows and Linux
 
## Code Structure

The `app/main.js` file is the entry file for webpack. It is a React front end using Babel to enable JSX, ES6, and ES7
 features.

The `shell/main.js` is the entry point for electron. This file is similar to a server.js file for a nodejs web server. 
It handles spawning the main electron window (renderer) process, and creating the electron menus.

## Building and Packaging the app

- npm run build-all

This will produce built and packaged applications for Mac, Windows, and Linux

`package.json` denotes all the dependencies for running the app locally, and producing the webpack build.

`package.build.json` has been separated and is used to install only the dependencies that are relevant to the 
packaged applications (this helps reduce the final file size of the applications).


## Testing and Code Coverage
- npm test
- npm run test-coverage

### Test with Nyan Cat Reporter >^.w.^<
- npm run test-nyan (for Nyan Cat reporter)

### Run a Single Test
- mocha --compilers js:babel-core/register --grep testName


To see the results of the test coverage, view the `coverage/lcov-report/index.html` file in your browser

