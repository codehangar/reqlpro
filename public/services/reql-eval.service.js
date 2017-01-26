'use strict';

import r from 'rethinkdb';
import co from 'co';

function ReQLEval(script) {
  return new Promise(function(resolve, reject) {
    co(function*() {
      // Wipe out global variables for the context of eval
      let window, GLOBAL, global, require, process;

      const string = '"use strict"; var obj = ' + script + '; obj;';

      const result = ((r) => eval(string))(r);
      resolve(result);
    }).catch(function(err) {
      reject(err);
    });
  });
}

export default ReQLEval;
