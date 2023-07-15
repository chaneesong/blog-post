const separateHeader = (content) => {
  const headerPattern = /^---\n([\s\S]*?)\n---/m;
  const headerMatch = content.match(headerPattern);
  if (!headerMatch) {
    console.error(`Error: Header not found in ${file}`);
    process.exit(1);
  }
  return headerMatch[1].split('\n');
};

export default separateHeader;
