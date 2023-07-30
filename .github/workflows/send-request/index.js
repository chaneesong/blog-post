import frontMatter from 'front-matter';
import checkHeaderValidity from './markdown/headerValidation/index.js';
import sendRequestByFileType from './request/sendRequestByFileType.js';
import parsePushedFileTextToArray from './parser/parsePushedFile.js';
import getMarkdown from './markdown/getMarkdown.js';

const main = async () => {
  let hasValidationFailed = false;

  try {
    // Read all Markdown files and validate headers
    const pushedFileText = process.argv[2];
    const pushedFiles = parsePushedFileTextToArray(pushedFileText);

    for (const [fileType, filePath] of pushedFiles) {
      const { stdout } = await getMarkdown(fileType, filePath);
      const markdown = frontMatter(stdout);

      const { attributes, body } = markdown;
      checkHeaderValidity(fileType, attributes);
      sendRequestByFileType(fileType, attributes, body);
    }
  } catch (error) {
    hasValidationFailed = true;
    console.error(error);
  }

  // Exit with a non-zero status code if any validation has failed
  if (hasValidationFailed) {
    process.exit(1);
  }
};

main();
