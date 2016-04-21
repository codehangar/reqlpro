console.log('start');

var spawn = require('child_process').spawn;

var child = spawn('webpack', ['--colors']);
child.stderr.pipe(process.stderr);
child.stdout.pipe(process.stdout);
child.stdout.on('data', function(chunk) {

  var child2 = spawn('electron', ['main.js']);
  child2.stdout.pipe(process.stdout);
  child2.stderr.pipe(process.stderr);

  var child3 = spawn('webpack', ['--colors', '--watch']);
  child3.stdout.pipe(process.stdout);
  child3.stderr.pipe(process.stderr);
});
