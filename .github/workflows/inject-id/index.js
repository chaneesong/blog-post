const main = () => {
  const responseText = process.argv[2];
  const match = responseText.match(/\[add\](.*)/s);
  console.log(match[1].trim());
};

main();
