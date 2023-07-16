import checkHeaderValidity from './checkHeaderValidity/index.js';

// Read all Markdown files and validate headers
const file = process.argv[1];
let hasValidationFailed = false;

if (file.endsWith('.md')) {
  try {
    checkHeaderValidity(file);
  } catch (error) {
    hasValidationFailed = true;
    console.error(error);
  }
}

// Exit with a non-zero status code if any validation has failed
if (hasValidationFailed) {
  process.exit(1);
}
