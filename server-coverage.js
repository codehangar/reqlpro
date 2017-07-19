'use strict';

const express = require('express');
const app = express();

/** Static Files */
app.use('/', express.static(__dirname + '/coverage/lcov-report/'));

/** This route deals enables HTML5Mode by forwarding missing files to the index.html */
// app.get('/*', function(req, res) {
//     res.sendFile(__dirname + '/dist/index.html')
// });

const port = process.env.PORT || 8001;
const server = app.listen(port, function() {
  console.log('listening on port: %s', port);
});

module.exports = app;
