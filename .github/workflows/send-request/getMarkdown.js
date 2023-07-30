import { spawn } from 'node:child_process';

const getMarkdown = async (filePath) => {
  const command = 'git';
  const args = ['show', `HAED:${filePath}`];

  const childProcess = spawn(command, args);

  let stdoutData = '';
  let stderrData = '';

  childProcess.stdout.on('data', (data) => {
    stdoutData += data.toString();
  });

  childProcess.stderr.on('data', (data) => {
    stderrData += data.toString();
  });

  const exitCode = await new Promise((resolve, reject) => {
    childProcess.on('error', (error) => {
      reject(error);
    });

    childProcess.on('close', (code) => {
      resolve(code);
    });
  });

  return { stdout: stdoutData, stderr: stderrData, exitCode };
};

export default getMarkdown;
