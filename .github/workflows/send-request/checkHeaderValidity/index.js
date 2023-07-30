import fs from 'fs';
import getExistingTitles from './getExistingTitles.js';
import separateHeader from '../parse/separateHeader.js';
import parseHeader from '../parse/parseHeader.js';
import getNow from '../utils/getNow.js';

const checkHeaderValidity = (file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const header = separateHeader(content);
  const { title, createdAt, category } = parseHeader(header);
  const now = getNow();
  const existingTitles = getExistingTitles();

  // Title duplication check
  if (existingTitles.filter((el) => el === title).length > 1) {
    console.error(`Error: Duplicate title found in ${file}`);
    process.exit(1);
  }

  // createdAt future date check
  if (new Date(createdAt) > now) {
    console.error(`Error: Future createdAt date found in ${file}`);
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
