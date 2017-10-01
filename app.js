const express = require('express');
const app = express();

const PORT = 5000;

// index route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// about route
app.get('/about', (req, res) => {
  res.send('About');
});

// server listening
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
