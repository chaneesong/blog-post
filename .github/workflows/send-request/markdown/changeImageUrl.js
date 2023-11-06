export const changeImageUrl = (markdownText, imageIds) => {
  const regex = /!\[[^\]]*\]\(([^)]*)\)/g;
  const modifiedMarkdownContent = markdownText.replace(regex, (match, url) => {
    const imageName = url.split('/')[2];
    const imageId = imageIds[imageName];
    if (imageId) {
      return `![${imageName}](${process.env.PREV_IMAGE_URL}${imageId})`;
    }
    return match;
  });

  return modifiedMarkdownContent;
};
