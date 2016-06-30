'use strict';

var r = window.nodeRequire('rethinkdb');
var co = require('co');

var ReQLEval = function(script) {
  return new Promise(function(resolve, reject) {
    co(function*() {
      // Wipe out global variables for the context of eval
      var window, GLOBAL, global, require, process;

      const string = '"use strict"; var obj = ' + script + '; obj;';

      const result = eval(string);
      resolve(result);
    }).catch(function(err) {
      reject(err);
    });
  });
};

module.exports = ReQLEval;
