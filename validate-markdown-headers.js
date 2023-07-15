const fs = require('fs');

function checkHeaderValidity(file) {
  const content = fs.readFileSync(file, 'utf-8');

  const headerPattern = /^---\n([\s\S]*?)\n---/m;
  const headerMatch = content.match(headerPattern);
  if (!headerMatch) {
    console.error(`Error: Header not found in ${file}`);
    process.exit(1);
  }

  const header = headerMatch[1];
  const lines = header.split('\n');

  const headers = {};
  lines.forEach((line) => {
    const [key, value] = line.split(':').map((item) => item.trim());
    headers[key.toLowerCase()] = value;
  });

  // Perform header validations
  const title = headers['title'];
  const createdAt = headers['createdat'];
  const category = headers['category'];
  const tags = headers['tags'];

  // Title duplication check
  const existingTitles = getExistingTitles(); // Retrieve existing titles from your repository
  if (existingTitles.includes(title)) {
    console.error(`Error: Duplicate title found in ${file}`);
    process.exit(1);
  }

  // createdAt future date check
  if (new Date(createdAt) > new Date()) {
    console.error(`Error: Future createdAt date found in ${file}`);
    process.exit(1);
  }

  // category single check
  const categoryCount = category.split(',').length;
  if (categoryCount > 1) {
    console.error(`Error: Multiple categories found in ${file}`);
    process.exit(1);
  }
}

// Example function to retrieve existing titles
function getExistingTitles() {
  // Implement your logic to retrieve existing titles from your repository
  // For example, you can fetch the titles from an API or read them from a file
  return ['Existing Title 1', 'Existing Title 2', 'Existing Title 3'];
}

// Read all Markdown files and validate headers
const markdownFiles = fs.readdirSync('./');
let hasValidationFailed = false;

markdownFiles.forEach((file) => {
  if (file.endsWith('.md')) {
    try {
      checkHeaderValidity(file);
    } catch (error) {
      hasValidationFailed = true;
      console.error(error);
    }
  }
});

// Exit with a non-zero status code if any validation has failed
if (hasValidationFailed) {
  process.exit(1);
}
