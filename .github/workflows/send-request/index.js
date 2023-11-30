import frontMatter from 'front-matter';
import checkHeaderValidity from './markdown/headerValidation/index.js';
import sendRequestByFileType from './markdown/sendRequestByFileType.js';
import { filterMarkdownToPushedFiles } from './parser/parsePushedFile.js';
import { getMarkdownContents } from './markdown/getMarkdown.js';
import { changeImageUrl } from './markdown/changeImageUrl.js';
import { uploadImage } from './googleDrive/uploadImage.js';
import { injectId } from './markdown/injectId.js';

const main = async () => {
  let hasValidationFailed = false;

  try {
    const pushedFileText = process.argv[2];
    const pushedFiles = filterMarkdownToPushedFiles(pushedFileText);

    for (const [fileType, fileName] of pushedFiles) {
      const { stdout } = await getMarkdownContents(fileType, fileName);
      const imgIds = await uploadImage(fileName);
      const modifiedMarkdownContent = changeImageUrl(stdout, imgIds);
      const markdown = frontMatter(modifiedMarkdownContent);
      const { attributes, body } = markdown;

      checkHeaderValidity(fileType, attributes);
      const resData = await sendRequestByFileType(fileType, attributes, body);
      injectId(fileName, resData, fileType);
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
