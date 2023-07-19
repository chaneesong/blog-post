import checkHeaderValidity from './checkHeaderValidity/index.js';

// Read all Markdown files and validate headers
const file = process.argv[2];
let hasValidationFailed = false;

const [fileType, filePath] = file.trim().split('\t');

console.log('filePath', filePath);

if (!filePath) {
  console.error('file is undefined.');
  process.exit(1);
}

if (filePath.endsWith('.md')) {
  try {
    checkHeaderValidity(filePath);
  } catch (error) {
    hasValidationFailed = true;
    console.error(error);
  }
}

// Exit with a non-zero status code if any validation has failed
if (hasValidationFailed) {
  process.exit(1);
}
