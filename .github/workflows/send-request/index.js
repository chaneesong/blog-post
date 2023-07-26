import checkHeaderValidity from './checkHeaerValidity/index.js';
import fs from 'fs';
import frontMatter from 'front-matter';

// Read all Markdown files and validate headers
const file = process.argv[2];
let hasValidationFailed = false;

const [fileType, filePath] = file.trim().split('\t');
const content = fs.readFileSync(filePath, 'utf-8');
const markdown = frontMatter(content);
console.log('content', markdown);

if (!filePath) {
  console.error('file is undefined.');
  process.exit(1);
}

if (filePath.endsWith('.md')) {
  try {
    checkHeaderValidity(filePath);
    // sendRequestPostData(fileType, filePath);
  } catch (error) {
    hasValidationFailed = true;
    console.error(error);
  }
}

// Exit with a non-zero status code if any validation has failed
if (hasValidationFailed) {
  process.exit(1);
}
