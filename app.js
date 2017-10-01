const express = require('express');
const app = express();

const exphbs = require('express-handlebars');

const PORT = 5000;

// handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// index route
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Index'
  });
});

// about route
app.get('/about', (req, res) => {
  res.render('about');
});

// server listening
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
