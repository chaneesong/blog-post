import frontMatter from 'front-matter';
import checkHeaderValidity from './checkHeaderValidity/index.js';
import sendRequestByFileType from './sendRequestByFileType.js';
import parsePushedFileTextToArray from './parse/parsePushedFile.js';
import getMarkdown from './getMarkdown.js';

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
