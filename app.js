// import dependencies
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// constants
const PORT = 5000;

// load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// map global promise - get rid of warning
// remove mongoose deprecated promise
mongoose.Promise = global.Promise;

// set up mongoose/mongodb connection
mongoose.connect('mongodb://localhost/nota', {
  useMongoClient: true // to prevent warning
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

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

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connectflash middleware
app.use(flash());

// global variables
app.use((req, res, next) => {
  res.locals.successMsg = req.flash('successMsg');
  res.locals.errorMsg = req.flash('errorMsg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
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

// routes
app.use('/ideas', ideas);
app.use('/users', users);

// passport config
require('./config/passport')(passport);

// server listening
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
