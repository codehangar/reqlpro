console.log('start');
const spawn = require('child_process').spawn;
const env = Object.assign({}, process.env, {
  HOT: 1,
  NODE_ENV: 'development'
});

const child1 = spawn('node', ['webpack.server'], { shell: true });
child1.stdout.pipe(process.stdout);
child1.stderr.pipe(process.stderr);

const child2 = spawn('electron', ['./shell/main.js', '--dev'], {
  shell: true,
  env: env
});
child2.stdout.pipe(process.stdout);
child2.stderr.pipe(process.stderr);

