import frontMatter from 'front-matter';
import checkHeaderValidity from './markdown/headerValidation/index.js';
import sendRequestByFileType from './markdown/sendRequestByFileType.js';
import { filterMarkdownToPushedFiles } from './parser/parsePushedFile.js';
import { getMarkdownContents } from './markdown/getMarkdown.js';

const main = async () => {
  let hasValidationFailed = false;

  try {
    const pushedFileText = process.argv[2];
    const pushedFiles = filterMarkdownToPushedFiles(pushedFileText);

    for (const [fileType, filePath] of pushedFiles) {
      const { stdout } = await getMarkdownContents(fileType, filePath);
      const markdown = frontMatter(stdout);

      const { attributes, body } = markdown;
      checkHeaderValidity(fileType, attributes);
      sendRequestByFileType(fileType, attributes, body);
    }
  } catch (error) {
    hasValidationFailed = true;
    console.error(error);
  }

  if (hasValidationFailed) {
    process.exit(1);
  }
};

main();
