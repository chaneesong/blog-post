const main = () => {
  const responseText = process.argv[2];
  const match = responseText.match(/\[add\](.*)/s);
  if (match) {
    console.log(match[1].trim());
  }
};

main();
