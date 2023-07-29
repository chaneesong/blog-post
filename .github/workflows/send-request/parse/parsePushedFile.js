const parsePushedFileTextToArray = (pushedFileText) => {
  const pushedFiles = pushedFileText.trim().split('\n');
  const filteredFiles = pushedFiles.filter((file) => file[1].endsWith('.md'));
  const splitedFilesInfo = filteredFiles.map((file) => file.split('\t'));

  return splitedFilesInfo;
};

export default parsePushedFileTextToArray;
