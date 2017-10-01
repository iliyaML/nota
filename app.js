// import dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

const PORT = 5000;

// map global promise - get rid of warning
// remove mongoose deprecated promise
mongoose.Promise = global.Promise;

// set up mongoose/mongodb connection
mongoose.connect('mongodb://localhost/nota', {
  useMongoClient: true // to prevent warning
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

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
