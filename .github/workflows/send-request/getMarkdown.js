import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const getMarkdown = async (filePath) => {
  try {
    const command = `git show HEAD:${filePath}`;
    const { stdout, stderr } = await promisify(exec)(command);

    console.error(stderr);
    return stdout;
  } catch (error) {
    console.error(error);
  }
};

export default getMarkdown;
