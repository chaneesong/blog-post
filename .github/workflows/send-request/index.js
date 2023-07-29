import fs from 'fs';
import frontMatter from 'front-matter';
import checkHeaderValidity from './checkHeaerValidity/index.js';
import sendRequestToFileType from './sendRequestToFileType.js';
import parsePushedFileTextToArray from './parse/parsePushedFile.js';

let hasValidationFailed = false;

try {
  // Read all Markdown files and validate headers
  const pushedFileText = process.argv[2];
  const parsedPushedFile = parsePushedFileTextToArray(pushedFileText);
  console.log(parsedPushedFile);

  // const [fileType, filePath] = file.trim().split('\t');
  // const content = fs.readFileSync(filePath, 'utf-8');
  // const markdown = frontMatter(content);

  // const { attributes, body } = markdown;
  // checkHeaderValidity(filePath);
  // sendRequestToFileType(fileType, attributes, body);
} catch (error) {
  hasValidationFailed = true;
  console.error(error);
}

// Exit with a non-zero status code if any validation has failed
if (hasValidationFailed) {
  process.exit(1);
}
