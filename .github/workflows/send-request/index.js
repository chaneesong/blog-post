import frontMatter from 'front-matter';
import checkHeaderValidity from './markdown/headerValidation/index.js';
import sendRequestByFileType from './request/sendRequestByFileType.js';
import parsePushedFileTextToArray from './parser/parsePushedFile.js';
import { getMarkdownFileName } from './markdown/getMarkdown.js';

const main = async () => {
  let hasValidationFailed = false;

  try {
    const pushedFileText = process.argv[2];
    const pushedFiles = parsePushedFileTextToArray(pushedFileText);
    console.log('pushed', pushedFileText);

    for (const [fileType, filePath] of pushedFiles) {
      const { stdout } = await getMarkdownFileName(fileType, filePath);
      console.log('stdout', stdout);
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
