# RethinkDB Client

## Setup

- Install Node Canvas - https://sites.google.com/a/codehangar.io/general/installing-node-canvas
- npm install
- npm start

You have to stop and start the process on code changes, until we get a live reload type solution setup.

## Code Structure

The main.js file at root is similar to a server.js file for a node web server. It handles spawning the main window process.

The public folder has all the HTLM, CSS, and Javascript essential to most of the application.

The main.js file at the root of the public folder is the entry file for webpack, and outputs a file called app.js in the root of scripts. The app.js file is what the index.html file is loading. This is bootstraping all the javascript the app is using.

The rethinkdb.client.js file is the the source of the truth for all the application state and handling events for letting the react components know how to update.

## Packaging app

- npm run build (builds the .app)
- npm run package (makes an archive of the app folder)
- delete Appfolder/AppName.app/Contents/Resources/app (this is so people cant see the source code of the app)