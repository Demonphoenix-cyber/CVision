const { spawn } = require('child_process');

console.log('Starting API Server (port 3001)...');
const apiProcess = spawn('node', ['--env-file=.env', 'api-server.mjs'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '3001' }
});

console.log('Starting React Dev Server (port 3000)...');
const reactProcess = spawn('npm', ['run', 'start'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '3000' }
});

// Forward exit signals to ensure both child processes exit cleanly
const cleanup = () => {
  apiProcess.kill();
  reactProcess.kill();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
