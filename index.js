const express = require('express');
const bodyParser = require('body-parser');
const dns = require('dns');
const path = require('path');

const app = express();
const port = 3000;

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Serve static files from the 'node_modules' folder
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Define routes
app.get('/', (req, res) => {
  res.render('index', { results: null });
});

app.post('/', async (req, res) => {
  const inputText = req.body.inputText;

  // Split input into an array of domains
  const domains = inputText.split('\n').map((line) => line.trim());

  // Validate domains
  const results = await Promise.all(domains.map(validateDomain));

  res.render('index', { results });
});

// Domain validation function
async function validateDomain(domain) {
  return new Promise((resolve) => {
    dns.resolve(domain, 'A', (err) => {
      const isValid = !err;
      resolve({ domain, isValid });
    });
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
