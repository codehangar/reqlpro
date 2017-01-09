# RethinkDB Client

## Setup

- npm install
- npm start

## Code Structure

The main.js file at root is similar to a server.js file for a node web server. It handles spawning the main window process.

The public folder has all the HTML, CSS, and Javascript essential to most of the application.

The main.js file at the root of the public folder is the entry file for webpack, and outputs a file called app.js in the root of scripts. The app.js file is what the index.html file is loading. This is bootstraping all the javascript the app is using.

The rethinkdb.client.js file is the the source of the truth for all the application state and handling events for letting the react components know how to update.

## Packaging app

- npm run build (builds the .app)
- npm run package (makes an archive of the app folder)
- delete Appfolder/AppName.app/Contents/Resources/app (this is so people cant see the source code of the app)

## Mac Packaging
- You will need to install this npm package locally. We cannot add to this package.json because it fails in linux npm installs (i.e. our CI server)
- https://www.npmjs.com/package/appdmg

## Testing and Code Coverage
- npm test
- npm run test-coverage

To see the results of the test coverage, view the `coverage/lcov-report/index.html` file in your browser

