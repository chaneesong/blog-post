import fs from 'fs';
import { ADDED } from '../utils/getCommitState.js';

// 응답 객체를 가공하는 함수
const selectProperties = (response) => {
  const { id, title, content, category, tags } = response;
  const tagKeywords = tags.map((tag) => tag.keyword);
  return { id, title, category: category.keyword, tags: tagKeywords, content };
};

// 헤더 객체를 통해 마크다운 헤더를 다시 만드는 함수
const setHeader = (header) => {
  let result = '';
  const entry = Object.entries(header);
  for (const value of entry) {
    result += Array.isArray(value[1])
      ? `${value[0]}: [${value[1].join(', ')}]\n`
      : `${value[0]}: ${value[1]}\n`;
  }
  return result.trim();
};

// id가 포함된 마크다운을 다시 만드는 함수
const rebuildMarkdown = (object) => {
  const { content, ...header } = object;
  const headerText = setHeader(header);
  const markdownText = `---
${headerText}
---

${object.content}`;

  return markdownText;
};

// 마크다운 파일에 id를 포함하여 덮어쓰는 함수
const overwriteFile = (fileName, markdown) => {
  try {
    fs.writeFileSync(fileName, markdown);
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
};

// 서버에서 받아온 id를 마크다운 문서에 삽입하는 함수
export const injectId = (fileName, data, fileType) => {
  if (fileType !== ADDED) {
    return;
  }
  try {
    const parsedResponse = selectProperties(data);
    const markdown = rebuildMarkdown(parsedResponse);
    overwriteFile(fileName, markdown);
    console.log('File overwritten successfully.');
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
};
