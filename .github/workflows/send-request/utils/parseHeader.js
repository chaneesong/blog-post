const parseHeader = (header) => {
  const headerInfo = {};
  header.forEach((line) => {
    const [key, value] = line.split(':').map((item) => item.trim());
    headerInfo[key] = value;
  });

  headerInfo['tags'] = headerInfo['tags']
    ?.slice(1, -1)
    .split(',')
    .map((item) => item.trim());
  return headerInfo;
};

export default parseHeader;
