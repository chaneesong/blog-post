import fs from 'fs';
import path from 'path';
import separateHeader from '../utils/separateHeader.js';
import parseHeader from '../utils/parseHeader.js';

const getExistingTitles = () => {
  const files = fs.readdirSync('./');

  const markdownFiles = files.filter((file) => file.endsWith('.md'));
  const titles = [];

  markdownFiles.forEach((file) => {
    const filePath = path.join('./', file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const header = separateHeader(content);
    const headerInfo = parseHeader(header);

    titles.push(headerInfo['title']);
  });

  return titles;
};

export default getExistingTitles;
