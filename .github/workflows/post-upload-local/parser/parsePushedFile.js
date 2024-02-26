// 푸시 된 파일 중 마크다운 파일만 추출하는 함수
export const filterMarkdownToPushedFiles = (pushedFileText) => {
  const pushedFiles = pushedFileText.trim().split('\n');
  const filteredFiles = pushedFiles.filter((file) => file.endsWith('.md'));
  const splitedFilesInfo = filteredFiles.map((file) => file.split('\t'));

  return splitedFilesInfo;
};
