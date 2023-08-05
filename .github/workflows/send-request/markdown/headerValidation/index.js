import getExistingTitles from './getExistingTitles.js';
import { DELETED } from '../../utils/getCommitState.js';

const checkHeaderValidity = (fileType, header) => {
  if (fileType === DELETED) return;

  const { title, category } = header;
  const existingTitles = getExistingTitles();

  // Title duplication check
  if (existingTitles.filter((el) => el === title).length > 1) {
    console.error(`Error: Duplicate title found in ${file}`);
    process.exit(1);
  }

  // category single check
  const categoryCount = category.split(',').length;
  if (categoryCount > 1) {
    console.error(`Error: Multiple categories found in ${file}`);
    process.exit(1);
  }
};

export default checkHeaderValidity;
