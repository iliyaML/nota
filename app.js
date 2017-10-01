// import dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

// constants
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

// bodyparser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

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

// add idea form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// edit idea form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea: idea
    });
  });
});

// idea index page
app.get('/ideas', (req, res) => {
  Idea.find({})
  .sort({ date: 'desc' })
  .then(ideas => {
    res.render('ideas/index', {
      ideas: ideas
    });
  });
});

// process idea form
app.post('/ideas', (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({ text: 'Please add a title' });
  }
  if(!req.body.details){
    errors.push({ text: 'Please add some details' });
  }

  // if there are errors
  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    // if no error

    const newUser = {
      title: req.body.title,
      details: req.body.details,
    }

    new Idea(newUser).save().then(idea => {
      res.redirect('/ideas');
    });
  }
});

// server listening
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
