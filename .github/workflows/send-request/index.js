import fs from 'fs';
import frontMatter from 'front-matter';
import checkHeaderValidity from './checkHeaderValidity/index.js';
import sendRequestToFileType from './sendRequestByFileType.js';
import parsePushedFileTextToArray from './parse/parsePushedFile.js';
import getMarkdown from './getMarkdown.js';

let hasValidationFailed = false;

try {
  // Read all Markdown files and validate headers
  const pushedFileText = process.argv[2];
  const pushedFiles = parsePushedFileTextToArray(pushedFileText);

  for (const [fileType, filePath] of pushedFiles) {
    const content = getMarkdown(filePath);
    const markdown = frontMatter(content);

    const { attributes, body } = markdown;
    checkHeaderValidity(filePath);
    sendRequestToFileType(fileType, attributes, body);
  }
} catch (error) {
  hasValidationFailed = true;
  console.error(error);
}

// Exit with a non-zero status code if any validation has failed
if (hasValidationFailed) {
  process.exit(1);
}
