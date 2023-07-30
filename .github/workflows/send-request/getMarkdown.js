import { spawn } from 'node:child_process';
import { DELETED } from './utils/getCommitState.js';

const getMarkdown = async (fileType, filePath) => {
  const command = 'git';
  const commitHash = fileType === DELETED ? 'HEAD^' : 'HEAD';
  const args = ['show', `${commitHash}:${filePath}`];

  const childProcess = spawn(command, args);

  let stdoutData = '';
  let stderrData = '';

  childProcess.stdout.on('data', (data) => {
    stdoutData += data.toString();
    console.log('stdout', stdoutData);
  });

  childProcess.stderr.on('data', (data) => {
    stderrData += data.toString();
    console.log(stderrData);
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
