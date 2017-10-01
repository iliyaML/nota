// import dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

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

// methodoverride middleware
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// expressession middleware
app.use(session({
  secret: 'bone bone',
  resave: false,
  saveUninitialized: true
}));

// connectflash middleware
app.use(flash());

// global variables
app.use((req, res, next) => {
  res.locals.successMsg = req.flash('successMsg');
  res.locals.errorMsg = req.flash('errorMsg');
  res.locals.error = req.flash('error');
  next();
});

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

// edit form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save()
    .then(idea => {
      req.flash('successMsg', 'Idea updated');
      res.redirect('/ideas');
    });
  });
});

// delete idea process
app.delete('/ideas/:id', (req, res) => {
  Idea.remove({ _id: req.params.id })
  .then(() => {
    req.flash('successMsg', 'Idea removed');
    res.redirect('/ideas');
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

    new Idea(newUser)
    .save()
    .then(idea => {
      req.flash('successMsg', 'Idea added');
      res.redirect('/ideas');
    });
  }
});

// server listening
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
