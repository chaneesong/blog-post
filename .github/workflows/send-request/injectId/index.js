import fs from 'fs';

const selectProperties = (response) => {
  const {
    id,
    title,
    content,
    category: categoryData,
    tags: tagsData,
  } = response;
  const { category } = categoryData;
  const tags = tagsData.map((tagData) => tagData.keyword);
  return { id, title, category, tags, content };
};

const parseHeader = (header) => {
  let result = '';
  const entiry = Object.entries(header);
  for (const value of entiry) {
    result = `${result}${value[0]}: ${value[1]}\n`;
  }
  return result.trim();
};

const convertToMarkdown = (object) => {
  const { content, ...header } = object;
  const headerText = parseHeader(header);
  const markdownText = `---
${headerText}
---

${object.content}`;

  return markdownText;
};

const overwriteFile = (title, markdown) => {
  try {
    fs.writeFileSync(`${title}.md`, markdown);
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
};

export const injectId = (data) => {
  try {
    const parsedResponse = selectProperties(data);
    const markdown = convertToMarkdown(parsedResponse);
    overwriteFile(title, markdown);
    console.log('File overwritten successfully.');
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
};
