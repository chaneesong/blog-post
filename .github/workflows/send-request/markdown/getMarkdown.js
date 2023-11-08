import { spawn } from 'node:child_process';
import { DELETED } from '../utils/getCommitState.js';

// 마크다운 컨텐츠를 읽어오는 함수
export const getMarkdownContents = async (fileType, filePath) => {
  const command = 'git';
  const commitHash = fileType === DELETED ? 'HEAD^' : 'HEAD';
  const args = ['show', `${commitHash}:${filePath}`];

  const childProcess = spawn(command, args);

  let stdoutData = '';
  let stderrData = '';

  childProcess.stdout.on('data', (data) => {
    stdoutData += data.toString();
  });

  childProcess.stderr.on('data', (data) => {
    stderrData += data.toString();
    console.error(stderrData);
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
