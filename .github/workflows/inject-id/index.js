const main = () => {
  const responseText = process.argv[2];
  console.log(responseText.slice(4, responseText.length - 1));
};

main();
